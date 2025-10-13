import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationForm } from "@/components/application-form"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export default async function ApplyPage({ params }: { params: { id: string } }) {
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  const opportunities = await sql`
    SELECT 
      o.*,
      h.id as host_id,
      h.name as host_name
    FROM public.opportunities o
    JOIN public.host_organizations h ON o.host_organization_id = h.id
    WHERE o.id = ${params.id}
  `

  if (opportunities.length === 0) {
    notFound()
  }

  const dbOpportunity = opportunities[0]

  // Transform to component format
  const opportunity = {
    id: dbOpportunity.id,
    title: dbOpportunity.title,
    theme: dbOpportunity.theme,
    location: dbOpportunity.location,
    minDuration: dbOpportunity.min_duration,
    maxDuration: dbOpportunity.max_duration,
    applicantTypes: dbOpportunity.applicant_types,
  }

  const host = {
    name: dbOpportunity.host_name,
  }

  // Check if user has already applied
  const existingApplication = await sql`
    SELECT id FROM public.applications
    WHERE user_id = ${user.id}
    AND opportunity_id = ${opportunity.id}
    LIMIT 1
  `

  if (existingApplication.length > 0) {
    redirect(`/opportunities/${opportunity.id}`)
  }

  // Fetch user profile
  const profileResult = await sql`
    SELECT * FROM public.profiles
    WHERE user_id = ${user.id}
    LIMIT 1
  `
  const profile = profileResult[0] || null

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Apply for Opportunity</h1>
        <p className="text-muted-foreground">Complete the form below to submit your application</p>
      </div>

      {/* Opportunity Summary */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {opportunity.theme.map((theme) => (
              <Badge key={theme} variant="secondary" className="capitalize">
                {theme}
              </Badge>
            ))}
          </div>
          <h2 className="mb-2 text-2xl font-bold">{opportunity.title}</h2>
          <p className="mb-4 text-muted-foreground">{host.name}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{opportunity.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {opportunity.minDuration}-{opportunity.maxDuration} weeks
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
          <CardDescription>
            Please provide accurate information. The host organization will review your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationForm user={user} profile={profile} opportunity={opportunity} host={host} />
        </CardContent>
      </Card>
    </div>
  )
}
