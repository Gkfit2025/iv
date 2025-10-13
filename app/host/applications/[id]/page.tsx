import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ApplicationReviewActions } from "@/components/application-review-actions"
import { Calendar, MapPin, User, Mail, Phone, Globe } from "lucide-react"
import { Header } from "@/components/header"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  // Get host organization
  const organizations = await sql`
    SELECT id FROM public.host_organizations WHERE user_id = ${user.id}
  `

  if (organizations.length === 0) {
    redirect("/host/profile")
  }

  // Fetch application with all details
  const applications = await sql`
    SELECT 
      a.*,
      o.title as opportunity_title,
      o.location as opportunity_location,
      o.country as opportunity_country,
      o.theme as opportunity_theme,
      o.min_duration,
      o.max_duration,
      p.full_name,
      p.phone,
      p.country as volunteer_country,
      p.bio
    FROM public.applications a
    JOIN public.opportunities o ON a.opportunity_id = o.id
    LEFT JOIN public.profiles p ON a.user_id = p.user_id
    WHERE a.id = ${params.id}
    AND o.host_organization_id = ${organizations[0].id}
  `

  if (applications.length === 0) {
    notFound()
  }

  const application = applications[0]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "withdrawn":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    }
  }

  return (
    <>
      <Header />
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <Link href="/host/applications">
            <Button variant="ghost" size="sm" className="mb-4">
              ← Back to Applications
            </Button>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Application Details</h1>
              <p className="text-muted-foreground">Review this application and take action</p>
            </div>
            <Badge className={getStatusColor(application.status)} variant="secondary">
              {application.status}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Opportunity Info */}
          <Card>
            <CardHeader>
              <CardTitle>Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="mb-2 text-xl font-semibold">{application.opportunity_title}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {application.opportunity_location}, {application.opportunity_country}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {application.min_duration}-{application.max_duration} weeks
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {application.opportunity_theme.map((theme: string) => (
                  <Badge key={theme} variant="outline" className="capitalize">
                    {theme}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Applicant Info */}
          <Card>
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Full Name</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p>{application.full_name || "Not provided"}</p>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{application.email}</p>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{application.phone || "Not provided"}</p>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Country</p>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <p>{application.volunteer_country || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {application.bio && (
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Bio</p>
                  <p className="text-sm leading-relaxed">{application.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Details */}
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Availability Start</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>
                      {application.availability_start
                        ? new Date(application.availability_start).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Availability End</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>
                      {application.availability_end
                        ? new Date(application.availability_end).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {application.motivation && (
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Motivation</p>
                  <p className="text-sm leading-relaxed">{application.motivation}</p>
                </div>
              )}

              {application.skills && (
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Skills & Experience</p>
                  <p className="text-sm leading-relaxed">{application.skills}</p>
                </div>
              )}

              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">Applied On</p>
                <p className="text-sm">{new Date(application.created_at).toLocaleString()}</p>
              </div>

              {application.updated_at && application.updated_at !== application.created_at && (
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{new Date(application.updated_at).toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {application.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Review Actions</CardTitle>
                <CardDescription>Approve or reject this application</CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicationReviewActions applicationId={application.id} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
