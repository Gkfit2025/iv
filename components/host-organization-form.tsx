"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface User {
  id: string
  email: string
}

interface HostOrganization {
  id: string
  name: string
  description: string
  location: string
  country: string
  website: string | null
  phone: string | null
  logo: string | null
  cover_image: string | null
  verified: boolean
  rating: number
  review_count: number
}

interface HostOrganizationFormProps {
  user: User
  organization: HostOrganization | null
}

export function HostOrganizationForm({ user, organization }: HostOrganizationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: organization?.name || "",
    description: organization?.description || "",
    location: organization?.location || "",
    country: organization?.country || "",
    website: organization?.website || "",
    phone: organization?.phone || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    // Validation
    if (!formData.name || !formData.description || !formData.location || !formData.country) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    try {
      const method = organization ? "PUT" : "POST"
      const response = await fetch("/api/host-organization", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save organization")
      }

      setSuccess(true)
      router.refresh()

      // If creating new organization, redirect to dashboard
      if (!organization) {
        setTimeout(() => router.push("/host/dashboard"), 1500)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Contact Email</Label>
        <Input id="email" type="email" value={user.email || ""} disabled />
        <p className="text-xs text-muted-foreground">This is your login email</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Organization Name *</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Grace Kennett Foundation"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your organization's mission, activities, and impact..."
          rows={5}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">City/Location *</Label>
          <Input
            id="location"
            type="text"
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
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="India"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://yourorganization.org"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 1234567890"
          />
        </div>
      </div>

      {organization && (
        <div className="rounded-lg bg-muted p-4">
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium">{organization.verified ? "Verified ✓" : "Pending Verification"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rating:</span>
              <span className="font-medium">{(Number(organization.rating) || 0).toFixed(1)} / 5.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reviews:</span>
              <span className="font-medium">{organization.review_count}</span>
            </div>
          </div>
        </div>
      )}

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
          {organization ? "Organization updated successfully!" : "Organization created successfully! Redirecting..."}
        </div>
      )}

      <Button type="submit" disabled={isLoading} size="lg" className="w-full">
        {isLoading ? "Saving..." : organization ? "Save Changes" : "Create Organization Profile"}
      </Button>
    </form>
  )
}
