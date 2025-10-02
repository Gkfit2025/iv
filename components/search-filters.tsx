"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, SlidersHorizontal } from "lucide-react"
import type { Theme, ApplicantType } from "@/lib/types"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void
}

export interface SearchFilters {
  searchTerm: string
  location: string
  themes: Theme[]
  applicantType: ApplicantType | "all"
  minDuration: number
  maxDuration: number
}

const themes: Theme[] = [
  "childcare",
  "medical",
  "wildlife",
  "heritage",
  "education",
  "community",
  "environment",
  "arts",
]

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([])
  const [applicantType, setApplicantType] = useState<ApplicantType | "all">("all")
  const [minDuration, setMinDuration] = useState(0)
  const [maxDuration, setMaxDuration] = useState(52)

  const handleSearch = () => {
    onSearch({
      searchTerm,
      location,
      themes: selectedThemes,
      applicantType,
      minDuration,
      maxDuration,
    })
  }

  const toggleTheme = (theme: Theme) => {
    setSelectedThemes((prev) => (prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]))
  }

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your search to find the perfect opportunity</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Location Filter */}
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="City or country..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Theme Filter */}
              <div className="space-y-3">
                <Label>Themes</Label>
                <div className="space-y-2">
                  {themes.map((theme) => (
                    <div key={theme} className="flex items-center space-x-2">
                      <Checkbox
                        id={theme}
                        checked={selectedThemes.includes(theme)}
                        onCheckedChange={() => toggleTheme(theme)}
                      />
                      <label
                        htmlFor={theme}
                        className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {theme}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applicant Type Filter */}
              <div className="space-y-2">
                <Label>Applicant Type</Label>
                <Select
                  value={applicantType}
                  onValueChange={(value) => setApplicantType(value as ApplicantType | "all")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration Filter */}
              <div className="space-y-2">
                <Label>Duration (weeks)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minDuration || ""}
                    onChange={(e) => setMinDuration(Number(e.target.value))}
                    min={0}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxDuration || ""}
                    onChange={(e) => setMaxDuration(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>

              <Button onClick={handleSearch} className="w-full">
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedThemes.length === 0 ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedThemes([])}
        >
          All Themes
        </Button>
        {themes.slice(0, 5).map((theme) => (
          <Button
            key={theme}
            variant={selectedThemes.includes(theme) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleTheme(theme)}
            className="capitalize"
          >
            {theme}
          </Button>
        ))}
      </div>
    </div>
  )
}
