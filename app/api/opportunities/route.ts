import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

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
    console.log("[v0] POST /api/opportunities - starting")

    const session = await getSession()
    console.log("[v0] Session:", session ? "exists" : "null")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get host organization
    const organizations = await sql`
      SELECT id FROM public.host_organizations WHERE user_id = ${session.id}
    `
    console.log("[v0] Organizations found:", organizations.length)

    if (organizations.length === 0) {
      return NextResponse.json(
        { error: "No organization found. Please create an organization profile first." },
        { status: 400 },
      )
    }

    const body = await request.json()
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

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

    const themeArray = Array.isArray(theme) ? theme : []
    const applicantTypesArray = Array.isArray(applicantTypes) ? applicantTypes : []
    const imagesArray = Array.isArray(images) ? images : []
    const requirementsArray = Array.isArray(requirements) ? requirements : []
    const benefitsArray = Array.isArray(benefits) ? benefits : []

    console.log("[v0] Prepared data:", {
      host_organization_id: organizations[0].id,
      title,
      theme: themeArray,
      applicantTypes: applicantTypesArray,
      minDuration,
      maxDuration,
      status: status || "active",
    })

    const result = await sql`
      INSERT INTO public.opportunities (
        host_organization_id, title, description, theme, location, country,
        applicant_types, min_duration, max_duration, images, requirements, benefits, status
      )
      VALUES (
        ${organizations[0].id}, 
        ${title}, 
        ${description}, 
        ${themeArray}, 
        ${location}, 
        ${country},
        ${applicantTypesArray}, 
        ${minDuration}, 
        ${maxDuration}, 
        ${imagesArray}, 
        ${requirementsArray}, 
        ${benefitsArray}, 
        ${status || "active"}
      )
      RETURNING *
    `

    console.log("[v0] Opportunity created successfully:", result[0].id)

    return NextResponse.json({ opportunity: result[0] })
  } catch (error) {
    console.error("[v0] Error creating opportunity:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error: error,
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create opportunity" },
      { status: 500 },
    )
  }
}
