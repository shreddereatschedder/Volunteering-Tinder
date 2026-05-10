import os
import json
import asyncio
import requests
from datetime import datetime

from bs4 import BeautifulSoup
from dotenv import load_dotenv
from playwright.async_api import async_playwright

from openai import OpenAI
from supabase import create_client

# ======================================================
# LOAD ENV
# ======================================================

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

BASE_URL = "https://volunteer.hiveportsmouth.com"

SEARCH_URL = "https://volunteer.hiveportsmouth.com/search-results/?postcode=&keyword="

# ======================================================
# AI: EXTRACT JOB DATA
# ======================================================

def extract_job(text, url):

    prompt = f"""
Extract volunteering opportunity as JSON.

Return ONLY JSON.

Fields:
- title
- location
- time_posted
- about
- requirements (array)
- benefits (array)
- organization

URL: {url}

CONTENT:
{text[:12000]}
"""

    res = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    data = json.loads(res.choices[0].message.content)
    data["source_url"] = url

    return data

# ======================================================
# AI: IMAGE PROMPT
# ======================================================

def make_image_prompt(job):

    prompt = f"""
Create a cinematic image prompt for a volunteering opportunity.

Title: {job.get("title")}
About: {job.get("about")}
Location: {job.get("location")}

Rules:
- no text in image
- emotional
- realistic cinematic style
- suitable for app swipe card
"""

    res = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return res.choices[0].message.content

# ======================================================
# AI IMAGE GENERATION
# ======================================================

def generate_image(prompt):

    img = client.images.generate(
        model="gpt-image-1",
        prompt=prompt,
        size="1024x1024"
    )

    return img.data[0].url

# ======================================================
# SUPABASE STORAGE UPLOAD
# ======================================================

def upload_image(image_url, name):

    img_data = requests.get(image_url).content

    file_path = f"{name}.png"

    supabase.storage.from_("opportunity-images").upload(
        file=img_data,
        path=file_path,
        file_options={"content-type": "image/png"}
    )

    return supabase.storage.from_(
        "opportunity-images"
    ).get_public_url(file_path)

# ======================================================
# SAVE TO DATABASE (YOUR SCHEMA)
# ======================================================

def save_job(job, image_url):

    # --- organisation ---
    org_name = job.get("organization", "Unknown")

    org = supabase.table("organisation") \
        .select("org_id") \
        .eq("name", org_name) \
        .execute()

    if org.data:
        org_id = org.data[0]["org_id"]
    else:
        inserted = supabase.table("organisation") \
            .insert({"name": org_name, "org_email": ""}) \
            .execute()
        org_id = inserted.data[0]["org_id"]

    # --- opportunity ---
    supabase.table("opportunity").upsert({
        "org_id": org_id,
        "title": job.get("title", ""),
        "location": job.get("location", ""),
        "time_posted": job.get("time_posted", ""),
        "about": job.get("about", ""),
        "requirements": job.get("requirements", []),
        "benefits": job.get("benefits", []),
        "image": image_url,
        "source_url": job.get("source_url"),
        "scraped_at": datetime.utcnow().isoformat()
    }, on_conflict="source_url").execute()

    print("Saved:", job.get("title"))

# ======================================================
# SCRAPE LISTINGS
# ======================================================

async def get_links(page):

    await page.goto(SEARCH_URL, wait_until="networkidle")
    await page.wait_for_timeout(3000)

    soup = BeautifulSoup(await page.content(), "lxml")

    links = set()

    for a in soup.find_all("a"):

        href = a.get("href")

        if href and "opportunity" in href:

            if href.startswith("http"):
                links.add(href)
            else:
                links.add(BASE_URL + href)

    return list(links)

# ======================================================
# SCRAPE ONE PAGE
# ======================================================

async def scrape(page, url):

    try:

        print("Scraping:", url)

        await page.goto(url, wait_until="networkidle")
        await page.wait_for_timeout(2000)

        soup = BeautifulSoup(await page.content(), "lxml")

        text = soup.get_text(" ", strip=True)

        job = extract_job(text, url)

        prompt = make_image_prompt(job)

        img_url = generate_image(prompt)

        final_img = upload_image(
            img_url,
            job["title"].replace(" ", "_")
        )

        save_job(job, final_img)

    except Exception as e:
        print("ERROR:", e)

# ======================================================
# MAIN
# ======================================================

async def main():

    async with async_playwright() as p:

        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        links = await get_links(page)

        print(f"Found {len(links)} opportunities")

        for link in links:
            await scrape(page, link)

        await browser.close()

# ======================================================
# RUN
# ======================================================

if __name__ == "__main__":
    asyncio.run(main())