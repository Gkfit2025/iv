"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sendEmail, getApplicationConfirmationEmail } from "@/lib/email"

interface User {
  id: string
  email: string
}

interface ApplicationFormProps {
  user: User
  profile: {
    full_name: string | null
    phone: string | null
    country: string | null
  } | null
  opportunity: {
    id: string
    title: string
    minDuration: number
    maxDuration: number
    applicantTypes: string[]
  }
  host:
    | {
        name: string
      }
    | undefined
}

export function ApplicationForm({ user, profile, opportunity, host }: ApplicationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    country: profile?.country || "",
    applicant_type: "",
    availability_start: "",
    availability_end: "",
    duration_weeks: "",
    motivation: "",
    relevant_experience: "",
    skills: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validation
    if (!formData.full_name || !formData.phone || !formData.country) {
      setError("Please fill in all required personal information fields")
      setIsLoading(false)
      return
    }

    if (
      !formData.applicant_type ||
      !formData.availability_start ||
      !formData.availability_end ||
      !formData.duration_weeks
    ) {
      setError("Please fill in all required application fields")
      setIsLoading(false)
      return
    }

    if (!formData.motivation) {
      setError("Please provide your motivation for applying")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          opportunity_id: opportunity.id,
          opportunity_title: opportunity.title,
          host_organization: host?.name || "Unknown",
          full_name: formData.full_name,
          email: user.email,
          phone: formData.phone,
          country: formData.country,
          applicant_type: formData.applicant_type,
          availability_start: formData.availability_start,
          availability_end: formData.availability_end,
          duration_weeks: Number.parseInt(formData.duration_weeks),
          motivation: formData.motivation,
          relevant_experience: formData.relevant_experience || null,
          skills: formData.skills || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit application")
      }

      // Update profile if needed
      if (
        formData.full_name !== profile?.full_name ||
        formData.phone !== profile?.phone ||
        formData.country !== profile?.country
      ) {
        await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            full_name: formData.full_name,
            phone: formData.phone,
            country: formData.country,
          }),
        })
      }

      try {
        const emailContent = getApplicationConfirmationEmail({
          applicantName: formData.full_name,
          opportunityTitle: opportunity.title,
          hostOrganization: host?.name || "Unknown",
        })

        await sendEmail({
          to: user.email || "",
          subject: emailContent.subject,
          html: emailContent.html,
        })
      } catch (emailError) {
        console.error("[v0] Failed to send confirmation email:", emailError)
        // Don't fail the application if email fails
      }

      router.push("/dashboard?application=success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" value={user.email || ""} disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
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
              placeholder="United States"
              required
            />
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Application Details</h3>

        <div className="space-y-2">
          <Label htmlFor="applicant_type">I am applying as *</Label>
          <Select
            value={formData.applicant_type}
            onValueChange={(value) => setFormData({ ...formData, applicant_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select applicant type" />
            </SelectTrigger>
            <SelectContent>
              {opportunity.applicantTypes.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="availability_start">Available From *</Label>
            <Input
              id="availability_start"
              type="date"
              value={formData.availability_start}
              onChange={(e) => setFormData({ ...formData, availability_start: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability_end">Available Until *</Label>
            <Input
              id="availability_end"
              type="date"
              value={formData.availability_end}
              onChange={(e) => setFormData({ ...formData, availability_end: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration_weeks">Preferred Duration (weeks) *</Label>
          <Input
            id="duration_weeks"
            type="number"
            min={opportunity.minDuration}
            max={opportunity.maxDuration}
            value={formData.duration_weeks}
            onChange={(e) => setFormData({ ...formData, duration_weeks: e.target.value })}
            placeholder={`Between ${opportunity.minDuration} and ${opportunity.maxDuration} weeks`}
            required
          />
        </div>
      </div>

      {/* Motivation & Experience */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tell Us About Yourself</h3>

        <div className="space-y-2">
          <Label htmlFor="motivation">Why do you want to join this opportunity? *</Label>
          <Textarea
            id="motivation"
            value={formData.motivation}
            onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
            placeholder="Share your motivation and what you hope to gain from this experience..."
            rows={5}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="relevant_experience">Relevant Experience (Optional)</Label>
          <Textarea
            id="relevant_experience"
            value={formData.relevant_experience}
            onChange={(e) => setFormData({ ...formData, relevant_experience: e.target.value })}
            placeholder="Describe any relevant experience, education, or background..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">Skills & Qualifications (Optional)</Label>
          <Textarea
            id="skills"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="List any skills, languages, certifications, or qualifications..."
            rows={4}
          />
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      <Button type="submit" disabled={isLoading} size="lg" className="w-full">
        {isLoading ? "Submitting Application..." : "Submit Application"}
      </Button>
    </form>
  )
}
