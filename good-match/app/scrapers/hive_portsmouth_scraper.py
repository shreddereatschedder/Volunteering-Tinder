import os
import json
import asyncio
from datetime import datetime

from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from openai import OpenAI
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

# =========================================================
# CONFIG
# =========================================================

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

BASE_URL = "https://volunteer.hiveportsmouth.com"
SEARCH_URL = (
    "https://volunteer.hiveportsmouth.com/search-results/"
    "?postcode=&keyword="
)

client = OpenAI(api_key=OPENAI_API_KEY)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# =========================================================
# AI EXTRACTION PROMPT
# =========================================================

SYSTEM_PROMPT = """
You extract volunteering opportunity data.

Return ONLY valid JSON.

Schema:

{
  "title": "",
  "location": "",
  "time_posted": "",
  "about": "",
  "requirements": [],
  "benefits": [],
  "image_url": "",
  "organization": ""
}

Rules:
- requirements must always be an array
- benefits must always be an array
- summarize long descriptions
- if missing use empty string
"""

# =========================================================
# DATABASE
# =========================================================

def save_opportunity(data):

    try:

        # -------------------------------------------------
        # 1. HANDLE ORGANISATION
        # -------------------------------------------------

        org_name = data.get("organization", "Unknown")

        org_result = (
            supabase
            .table("organisation")
            .select("org_id")
            .eq("name", org_name)
            .execute()
        )

        if org_result.data:

            org_id = org_result.data[0]["org_id"]

        else:

            inserted_org = (
                supabase
                .table("organisation")
                .insert({
                    "name": org_name,
                    "org_email": ""
                })
                .execute()
            )

            org_id = inserted_org.data[0]["org_id"]

        # -------------------------------------------------
        # 2. SAVE OPPORTUNITY
        # -------------------------------------------------

        response = (
            supabase
            .table("opportunity")
            .upsert(
                {
                    "org_id": org_id,
                    "title": data.get("title", ""),
                    "location": data.get("location", ""),
                    "time_posted": data.get("time_posted", ""),
                    "about": data.get("about", ""),
                    "requirements": data.get("requirements", []),
                    "benefits": data.get("benefits", []),
                    "image": data.get("image_url", ""),
                    "source_url": data.get("source_url", ""),
                    "scraped_at": datetime.utcnow().isoformat()
                },
                on_conflict="source_url"
            )
            .execute()
        )

        print("Saved:", data.get("title"))

        return response

    except Exception as e:

        print("DATABASE ERROR:", e)

# =========================================================
# HTML CLEANER
# =========================================================

def clean_html(html):
    soup = BeautifulSoup(html, "lxml")

    for tag in soup(["script", "style", "noscript"]):
        tag.extract()

    text = soup.get_text(separator=" ")

    return " ".join(text.split())

# =========================================================
# AI EXTRACTION
# =========================================================

async def extract_with_ai(text, image_url, source_url):

    prompt = f"""
SOURCE URL:
{source_url}

IMAGE:
{image_url}

PAGE CONTENT:
{text[:15000]}
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        response_format={"type": "json_object"}
    )

    data = json.loads(response.choices[0].message.content)

    data["source_url"] = source_url

    return data

# =========================================================
# GET ALL OPPORTUNITY LINKS
# =========================================================

async def get_listing_urls(page):

    print("Loading search page...")

    await page.goto(
        SEARCH_URL,
        wait_until="networkidle"
    )

    await page.wait_for_timeout(3000)

    html = await page.content()

    soup = BeautifulSoup(html, "lxml")

    urls = set()

    for link in soup.select("a"):

        href = link.get("href")

        if not href:
            continue

        if "/opportunities/" in href:

            if href.startswith("http"):
                urls.add(href)
            else:
                urls.add(BASE_URL + href)

    print(f"Found {len(urls)} opportunities")

    return list(urls)

# =========================================================
# SCRAPE SINGLE OPPORTUNITY
# =========================================================

async def scrape_opportunity(page, url):

    try:
        print("Scraping:", url)

        await page.goto(
            url,
            wait_until="networkidle"
        )

        await page.wait_for_timeout(2000)

        html = await page.content()

        soup = BeautifulSoup(html, "lxml")

        # Try to get image
        image_url = ""

        og_image = soup.select_one(
            'meta[property="og:image"]'
        )

        if og_image:
            image_url = og_image.get("content", "")

        # Clean page
        cleaned_text = clean_html(html)

        # AI extraction
        structured_data = await extract_with_ai(
            cleaned_text,
            image_url,
            url
        )

        # Save
        save_opportunity(structured_data)

    except Exception as e:
        print("SCRAPE ERROR:", e)

# =========================================================
# MAIN
# =========================================================

async def main():

    async with async_playwright() as p:

        browser = await p.chromium.launch(
            headless=True
        )

        context = await browser.new_context()

        page = await context.new_page()

        # Get all listings
        urls = await get_listing_urls(page)

        # Scrape sequentially
        for url in urls:
            await scrape_opportunity(page, url)

        await browser.close()

# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":
    asyncio.run(main())