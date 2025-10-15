"use client"

import { useState, useMemo } from "react"
import { OpportunityCard } from "@/components/opportunity-card"
import { SearchFilters, type SearchFilters as SearchFiltersType } from "@/components/search-filters"

interface Opportunity {
  id: string
  hostId: string
  title: string
  description: string
  theme: string[]
  location: string
  country: string
  applicantTypes: string[]
  minDuration: number
  maxDuration: number
  images: string[]
  requirements: string[]
  benefits: string[]
  featured: boolean
  host: {
    id: string
    name: string
    logo: string | null
    verified: boolean
    rating: number
    reviewCount: number
  }
}

interface SearchFiltersClientProps {
  opportunities: Opportunity[]
}

export function SearchFiltersClient({ opportunities }: SearchFiltersClientProps) {
  const [filters, setFilters] = useState<SearchFiltersType>({
    searchTerm: "",
    location: "",
    themes: [],
    applicantType: "all",
    minDuration: 0,
    maxDuration: 52,
  })

  const handleFilterChange = (newFilters: SearchFiltersType) => {
    console.log("[v0] Filters updated:", newFilters)
    setFilters(newFilters)
  }

  const filteredOpportunities = useMemo(() => {
    console.log("[v0] Filtering opportunities:", {
      totalOpportunities: opportunities.length,
      filters,
    })

    const filtered = opportunities.filter((opp) => {
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

    console.log("[v0] Filtered results:", filtered.length)
    return filtered
  }, [opportunities, filters])

  return (
    <>
      <div className="mb-8">
        <SearchFilters onSearch={handleFilterChange} />
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
    </>
  )
}
