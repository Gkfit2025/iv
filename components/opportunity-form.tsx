"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { Theme, ApplicantType } from "@/lib/types"

interface Opportunity {
  id: string
  title: string
  description: string
  theme: string[]
  location: string
  country: string
  applicant_types: string[]
  min_duration: number
  max_duration: number
  images: string[]
  requirements: string[]
  benefits: string[]
  status: string
}

interface OpportunityFormProps {
  opportunity?: Opportunity | null
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

export function OpportunityForm({ opportunity }: OpportunityFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: opportunity?.title || "",
    description: opportunity?.description || "",
    theme: opportunity?.theme || [],
    location: opportunity?.location || "",
    country: opportunity?.country || "",
    applicantTypes: opportunity?.applicant_types || [],
    minDuration: opportunity?.min_duration || 2,
    maxDuration: opportunity?.max_duration || 12,
    images: opportunity?.images || [],
    requirements: opportunity?.requirements || [],
    benefits: opportunity?.benefits || [],
    status: opportunity?.status || "active",
  })

  const [newRequirement, setNewRequirement] = useState("")
  const [newBenefit, setNewBenefit] = useState("")
  const [newImage, setNewImage] = useState("")

  const toggleTheme = (theme: Theme) => {
    setFormData((prev) => ({
      ...prev,
      theme: prev.theme.includes(theme) ? prev.theme.filter((t) => t !== theme) : [...prev.theme, theme],
    }))
  }

  const toggleApplicantType = (type: ApplicantType) => {
    setFormData((prev) => ({
      ...prev,
      applicantTypes: prev.applicantTypes.includes(type)
        ? prev.applicantTypes.filter((t) => t !== type)
        : [...prev.applicantTypes, type],
    }))
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }))
      setNewBenefit("")
    }
  }

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }))
  }

  const addImage = () => {
    if (newImage.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }))
      setNewImage("")
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validation
    if (!formData.title || !formData.description || !formData.location || !formData.country) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (formData.theme.length === 0) {
      setError("Please select at least one theme")
      setIsLoading(false)
      return
    }

    if (formData.applicantTypes.length === 0) {
      setError("Please select at least one applicant type")
      setIsLoading(false)
      return
    }

    if (formData.minDuration >= formData.maxDuration) {
      setError("Maximum duration must be greater than minimum duration")
      setIsLoading(false)
      return
    }

    try {
      const url = opportunity ? `/api/opportunities/${opportunity.id}` : "/api/opportunities"
      const method = opportunity ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save opportunity")
      }

      router.push("/host/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="space-y-2">
          <Label htmlFor="title">Opportunity Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Teaching English & Life Skills to Underprivileged Children"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the opportunity, what volunteers will do, and the impact they'll make..."
            rows={6}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">City/Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Madurai, Tamil Nadu"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="India"
              required
            />
          </div>
        </div>
      </div>

      {/* Themes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Themes *</h3>
        <p className="text-sm text-muted-foreground">Select all themes that apply to this opportunity</p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {themes.map((theme) => (
            <div key={theme} className="flex items-center space-x-2">
              <Checkbox
                id={`theme-${theme}`}
                checked={formData.theme.includes(theme)}
                onCheckedChange={() => toggleTheme(theme)}
              />
              <label htmlFor={`theme-${theme}`} className="text-sm font-medium capitalize leading-none">
                {theme}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Applicant Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Who can apply? *</h3>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="volunteer"
              checked={formData.applicantTypes.includes("volunteer")}
              onCheckedChange={() => toggleApplicantType("volunteer")}
            />
            <label htmlFor="volunteer" className="text-sm font-medium leading-none">
              Volunteers
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="intern"
              checked={formData.applicantTypes.includes("intern")}
              onCheckedChange={() => toggleApplicantType("intern")}
            />
            <label htmlFor="intern" className="text-sm font-medium leading-none">
              Interns
            </label>
          </div>
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Duration (in weeks) *</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="minDuration">Minimum Duration</Label>
            <Input
              id="minDuration"
              type="number"
              min={1}
              value={formData.minDuration}
              onChange={(e) => setFormData({ ...formData, minDuration: Number.parseInt(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxDuration">Maximum Duration</Label>
            <Input
              id="maxDuration"
              type="number"
              min={1}
              value={formData.maxDuration}
              onChange={(e) => setFormData({ ...formData, maxDuration: Number.parseInt(e.target.value) })}
              required
            />
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Requirements</h3>
        <div className="flex gap-2">
          <Input
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder="Add a requirement..."
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
          />
          <Button type="button" onClick={addRequirement} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.requirements.map((req, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {req}
              <button type="button" onClick={() => removeRequirement(index)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Benefits</h3>
        <div className="flex gap-2">
          <Input
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            placeholder="Add a benefit..."
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
          />
          <Button type="button" onClick={addBenefit} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.benefits.map((benefit, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {benefit}
              <button type="button" onClick={() => removeBenefit(index)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Images</h3>
        <p className="text-sm text-muted-foreground">Add image URLs for this opportunity</p>
        <div className="flex gap-2">
          <Input
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
          />
          <Button type="button" onClick={addImage} variant="outline">
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {formData.images.map((image, index) => (
            <div key={index} className="flex items-center gap-2 rounded-md border p-2">
              <span className="flex-1 truncate text-sm">{image}</span>
              <Button type="button" onClick={() => removeImage(index)} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Status</h3>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active - Accepting Applications</SelectItem>
            <SelectItem value="paused">Paused - Not Accepting Applications</SelectItem>
            <SelectItem value="closed">Closed - No Longer Available</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading ? "Saving..." : opportunity ? "Update Opportunity" : "Create Opportunity"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} size="lg">
          Cancel
        </Button>
      </div>
    </form>
  )
}
