import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

// GET - Fetch all opportunities (public) or host's opportunities
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hostOnly = searchParams.get("hostOnly") === "true"

    if (hostOnly) {
      const session = await getSession()
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Get host organization
      const organizations = await sql`
        SELECT id FROM public.host_organizations WHERE user_id = ${session.id}
      `

      if (organizations.length === 0) {
        return NextResponse.json({ opportunities: [] })
      }

      const opportunities = await sql`
        SELECT * FROM public.opportunities
        WHERE host_organization_id = ${organizations[0].id}
        ORDER BY created_at DESC
      `

      return NextResponse.json({ opportunities })
    }

    // Public: Get all active opportunities
    const opportunities = await sql`
      SELECT o.*, h.name as host_name, h.logo as host_logo, h.verified as host_verified,
             h.rating as host_rating, h.review_count as host_review_count
      FROM public.opportunities o
      JOIN public.host_organizations h ON o.host_organization_id = h.id
      WHERE o.status = 'active'
      ORDER BY o.featured DESC, o.created_at DESC
    `

    return NextResponse.json({ opportunities })
  } catch (error) {
    console.error("Error fetching opportunities:", error)
    return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 })
  }
}

// POST - Create new opportunity
export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get host organization
    const organizations = await sql`
      SELECT id FROM public.host_organizations WHERE user_id = ${session.id}
    `

    if (organizations.length === 0) {
      return NextResponse.json(
        { error: "No organization found. Please create an organization profile first." },
        { status: 400 },
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      theme,
      location,
      country,
      applicantTypes,
      minDuration,
      maxDuration,
      images,
      requirements,
      benefits,
      status,
    } = body

    const result = await sql`
      INSERT INTO public.opportunities (
        host_organization_id, title, description, theme, location, country,
        applicant_types, min_duration, max_duration, images, requirements, benefits, status
      )
      VALUES (
        ${organizations[0].id}, ${title}, ${description}, ${theme}, ${location}, ${country},
        ${applicantTypes}, ${minDuration}, ${maxDuration}, ${images || []}, 
        ${requirements || []}, ${benefits || []}, ${status || "active"}
      )
      RETURNING *
    `

    return NextResponse.json({ opportunity: result[0] })
  } catch (error) {
    console.error("Error creating opportunity:", error)
    return NextResponse.json({ error: "Failed to create opportunity" }, { status: 500 })
  }
}
