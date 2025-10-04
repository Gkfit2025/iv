import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationForm } from "@/components/application-form"
import { opportunities, hostOrganizations } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"

export default async function ApplyPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const opportunity = opportunities.find((opp) => opp.id === params.id)

  if (!opportunity) {
    notFound()
  }

  const host = hostOrganizations.find((h) => h.id === opportunity.hostId)

  // Check if user has already applied
  const { data: existingApplication } = await supabase
    .from("applications")
    .select("id")
    .eq("user_id", user.id)
    .eq("opportunity_id", opportunity.id)
    .single()

  if (existingApplication) {
    redirect(`/opportunities/${opportunity.id}`)
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

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
          <p className="mb-4 text-muted-foreground">{host?.name}</p>
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
