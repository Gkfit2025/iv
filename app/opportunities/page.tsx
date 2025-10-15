import { sql } from "@/lib/db"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchFiltersClient } from "@/components/search-filters-client"

export const dynamic = "force-dynamic"

export default async function OpportunitiesPage() {
  let opportunities = []
  try {
    opportunities = await sql`
      SELECT 
        o.*,
        h.id as host_id,
        h.name as host_name,
        h.logo as host_logo,
        h.verified as host_verified,
        h.rating as host_rating,
        h.review_count as host_review_count
      FROM public.opportunities o
      JOIN public.host_organizations h ON o.host_organization_id = h.id
      WHERE o.status = 'active'
      ORDER BY o.featured DESC, o.created_at DESC
    `
    console.log(`[v0] Fetched ${opportunities.length} opportunities from database`)
  } catch (error) {
    console.error("[v0] Error fetching opportunities:", error)
    // Return empty array if table doesn't exist yet
    opportunities = []
  }

  // Transform database format to component format
  const transformedOpportunities = opportunities.map((opp) => ({
    id: opp.id,
    hostId: opp.host_id,
    title: opp.title,
    description: opp.description,
    theme: opp.theme,
    location: opp.location,
    country: opp.country,
    applicantTypes: opp.applicant_types,
    minDuration: opp.min_duration,
    maxDuration: opp.max_duration,
    images: opp.images,
    requirements: opp.requirements,
    benefits: opp.benefits,
    featured: opp.featured,
    host: {
      id: opp.host_id,
      name: opp.host_name,
      logo: opp.host_logo,
      verified: opp.host_verified,
      rating: opp.host_rating,
      reviewCount: opp.host_review_count,
    },
  }))

  console.log(`[v0] Transformed ${transformedOpportunities.length} opportunities for display`)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Find Opportunities</h1>
          <p className="text-muted-foreground">Discover meaningful volunteer experiences around the world</p>
        </div>

        <SearchFiltersClient opportunities={transformedOpportunities} />
      </div>

      <Footer />
    </div>
  )
}
