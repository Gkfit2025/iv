import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const allHosts = await sql`
      SELECT id, name, logo, user_id
      FROM public.host_organizations
      ORDER BY created_at DESC
    `

    const allOpportunities = await sql`
      SELECT id, title, images, host_organization_id
      FROM public.opportunities
      ORDER BY created_at DESC
    `

    const icisoOpportunities = await sql`
      SELECT 
        o.id,
        o.title,
        o.images,
        o.host_organization_id,
        h.name as host_name,
        h.logo as host_logo
      FROM public.opportunities o
      JOIN public.host_organizations h ON o.host_organization_id = h.id
      WHERE h.name ILIKE '%ICISO%'
      ORDER BY o.created_at DESC
    `

    return NextResponse.json({
      success: true,
      all_hosts: {
        count: allHosts.length,
        hosts: allHosts.map((h) => ({
          id: h.id,
          name: h.name,
          name_length: h.name?.length,
          logo: h.logo,
          user_id: h.user_id,
        })),
      },
      all_opportunities: {
        count: allOpportunities.length,
        opportunities: allOpportunities.map((o) => ({
          id: o.id,
          title: o.title,
          images: o.images,
          images_type: typeof o.images,
          images_is_array: Array.isArray(o.images),
          host_organization_id: o.host_organization_id,
        })),
      },
      iciso_opportunities: {
        count: icisoOpportunities.length,
        opportunities: icisoOpportunities.map((opp) => ({
          id: opp.id,
          title: opp.title,
          images: opp.images,
          images_type: typeof opp.images,
          images_is_array: Array.isArray(opp.images),
          images_length: opp.images?.length || 0,
          host_name: opp.host_name,
          host_logo: opp.host_logo,
        })),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
