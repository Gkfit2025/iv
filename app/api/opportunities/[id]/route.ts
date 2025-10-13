import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

// GET - Fetch single opportunity
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const opportunities = await sql`
      SELECT o.*, h.name as host_name, h.logo as host_logo, h.verified as host_verified,
             h.rating as host_rating, h.review_count as host_review_count,
             h.description as host_description, h.location as host_location
      FROM public.opportunities o
      JOIN public.host_organizations h ON o.host_organization_id = h.id
      WHERE o.id = ${params.id}
    `

    if (opportunities.length === 0) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 })
    }

    return NextResponse.json({ opportunity: opportunities[0] })
  } catch (error) {
    console.error("Error fetching opportunity:", error)
    return NextResponse.json({ error: "Failed to fetch opportunity" }, { status: 500 })
  }
}

// PUT - Update opportunity
export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ error: "No organization found" }, { status: 400 })
    }

    // Verify ownership
    const existing = await sql`
      SELECT id FROM public.opportunities
      WHERE id = ${params.id} AND host_organization_id = ${organizations[0].id}
    `

    if (existing.length === 0) {
      return NextResponse.json({ error: "Opportunity not found or unauthorized" }, { status: 404 })
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
      UPDATE public.opportunities
      SET 
        title = ${title},
        description = ${description},
        theme = ${theme},
        location = ${location},
        country = ${country},
        applicant_types = ${applicantTypes},
        min_duration = ${minDuration},
        max_duration = ${maxDuration},
        images = ${images || []},
        requirements = ${requirements || []},
        benefits = ${benefits || []},
        status = ${status},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json({ opportunity: result[0] })
  } catch (error) {
    console.error("Error updating opportunity:", error)
    return NextResponse.json({ error: "Failed to update opportunity" }, { status: 500 })
  }
}

// DELETE - Delete opportunity
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ error: "No organization found" }, { status: 400 })
    }

    // Verify ownership and delete
    const result = await sql`
      DELETE FROM public.opportunities
      WHERE id = ${params.id} AND host_organization_id = ${organizations[0].id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Opportunity not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting opportunity:", error)
    return NextResponse.json({ error: "Failed to delete opportunity" }, { status: 500 })
  }
}
