import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      org_id,
      title,
      location,
      time_posted,
      about,
      requirements,
      benefits,
      image,
      source_url
    } = body;

    // Server-side Supabase client (service role)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("opportunity")
      .insert({
        org_id,
        title,
        location,
        time_posted,
        about,
        requirements,   // JSONB
        benefits,       // JSONB
        image,
        source_url
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json(
      { error: "Invalid request body", details: err.message },
      { status: 400 }
    );
  }
}
