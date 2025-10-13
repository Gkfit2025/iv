import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

// GET - Fetch host organization profile
export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organizations = await sql`
      SELECT * FROM public.host_organizations
      WHERE user_id = ${session.id}
      LIMIT 1
    `

    if (organizations.length === 0) {
      return NextResponse.json({ organization: null })
    }

    return NextResponse.json({ organization: organizations[0] })
  } catch (error) {
    console.error("Error fetching host organization:", error)
    return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 })
  }
}

// POST - Create host organization profile
export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, location, country, website, phone } = body

    // Check if organization already exists
    const existing = await sql`
      SELECT id FROM public.host_organizations
      WHERE user_id = ${session.id}
      LIMIT 1
    `

    if (existing.length > 0) {
      return NextResponse.json({ error: "Organization already exists" }, { status: 400 })
    }

    // Create organization
    const result = await sql`
      INSERT INTO public.host_organizations (
        user_id, name, description, location, country, website, phone
      )
      VALUES (
        ${session.id}, ${name}, ${description}, ${location}, ${country},
        ${website || null}, ${phone || null}
      )
      RETURNING *
    `

    return NextResponse.json({ organization: result[0] })
  } catch (error) {
    console.error("Error creating host organization:", error)
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 })
  }
}

// PUT - Update host organization profile
export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, location, country, website, phone, logo, cover_image } = body

    const result = await sql`
      UPDATE public.host_organizations
      SET 
        name = ${name},
        description = ${description},
        location = ${location},
        country = ${country},
        website = ${website || null},
        phone = ${phone || null},
        logo = ${logo || null},
        cover_image = ${cover_image || null},
        updated_at = NOW()
      WHERE user_id = ${session.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    return NextResponse.json({ organization: result[0] })
  } catch (error) {
    console.error("Error updating host organization:", error)
    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 })
  }
}
