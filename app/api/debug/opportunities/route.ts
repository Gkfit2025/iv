import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Fetch ICISO opportunities with all fields
    const opportunities = await sql`
      SELECT 
        o.id,
        o.title,
        o.images,
        o.host_organization_id,
        h.name as host_name,
        h.logo as host_logo
      FROM public.opportunities o
      JOIN public.host_organizations h ON o.host_organization_id = h.id
      WHERE h.name = 'ICISO'
      ORDER BY o.created_at DESC
    `

    return NextResponse.json({
      success: true,
      count: opportunities.length,
      opportunities: opportunities.map((opp) => ({
        id: opp.id,
        title: opp.title,
        images: opp.images,
        images_type: typeof opp.images,
        images_is_array: Array.isArray(opp.images),
        images_length: opp.images?.length || 0,
        host_name: opp.host_name,
        host_logo: opp.host_logo,
        host_logo_type: typeof opp.host_logo,
      })),
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
