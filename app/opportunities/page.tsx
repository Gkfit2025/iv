"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchFilters, type SearchFilters as SearchFiltersType } from "@/components/search-filters"
import { OpportunityCard } from "@/components/opportunity-card"
import { opportunities } from "@/lib/mock-data"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export default function OpportunitiesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [filters, setFilters] = useState<SearchFiltersType>({
    searchTerm: "",
    location: "",
    themes: [],
    applicantType: "all",
    minDuration: 0,
    maxDuration: 52,
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const matchesSearch =
          opp.title.toLowerCase().includes(searchLower) ||
          opp.description.toLowerCase().includes(searchLower) ||
          opp.location.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Location filter
      if (filters.location) {
        const locationLower = filters.location.toLowerCase()
        const matchesLocation =
          opp.location.toLowerCase().includes(locationLower) || opp.country.toLowerCase().includes(locationLower)
        if (!matchesLocation) return false
      }

      // Theme filter
      if (filters.themes.length > 0) {
        const hasMatchingTheme = filters.themes.some((theme) => opp.theme.includes(theme))
        if (!hasMatchingTheme) return false
      }

      // Applicant type filter
      if (filters.applicantType !== "all") {
        if (!opp.applicantTypes.includes(filters.applicantType)) return false
      }

      // Duration filter
      if (filters.minDuration > 0 && opp.maxDuration < filters.minDuration) {
        return false
      }
      if (filters.maxDuration > 0 && opp.minDuration > filters.maxDuration) {
        return false
      }

      return true
    })
  }, [filters])

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Find Opportunities</h1>
          <p className="text-muted-foreground">Discover meaningful volunteer experiences around the world</p>
        </div>

        <div className="mb-8">
          <SearchFilters onSearch={setFilters} />
        </div>

        <div className="mb-4 text-sm text-muted-foreground">{filteredOpportunities.length} opportunities found</div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No opportunities found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
