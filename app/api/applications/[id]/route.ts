import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

// GET - Fetch single application with details
export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    // Fetch application with opportunity and profile details
    const applications = await sql`
      SELECT 
        a.*,
        o.title as opportunity_title,
        o.location as opportunity_location,
        o.theme as opportunity_theme,
        p.full_name,
        p.phone,
        p.country as volunteer_country,
        p.bio
      FROM public.applications a
      JOIN public.opportunities o ON a.opportunity_id = o.id
      LEFT JOIN public.profiles p ON a.user_id = p.user_id
      WHERE a.id = ${params.id}
      AND o.host_organization_id = ${organizations[0].id}
    `

    if (applications.length === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ application: applications[0] })
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

// PATCH - Update application status
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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

    const body = await request.json()
    const { status } = body

    if (!["pending", "approved", "rejected", "withdrawn"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Verify ownership and update
    const result = await sql`
      UPDATE public.applications a
      SET status = ${status}, updated_at = NOW()
      FROM public.opportunities o
      WHERE a.id = ${params.id}
      AND a.opportunity_id = o.id
      AND o.host_organization_id = ${organizations[0].id}
      RETURNING a.*
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Application not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ application: result[0] })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}
