import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Calendar, MapPin, User, Mail } from "lucide-react"
import { Header } from "@/components/header"

export default async function HostApplicationsPage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch host organization
  const organizations = await sql`
    SELECT * FROM public.host_organizations WHERE user_id = ${user.id}
  `
  const organization = organizations[0]

  if (!organization) {
    redirect("/host/profile")
  }

  // Fetch all applications to this organization's opportunities
  const applications = await sql`
    SELECT 
      a.*,
      o.title as opportunity_title,
      o.location as opportunity_location,
      o.theme as opportunity_theme,
      p.full_name,
      p.country as volunteer_country
    FROM public.applications a
    JOIN public.opportunities o ON a.opportunity_id = o.id
    LEFT JOIN public.profiles p ON a.user_id = p.user_id
    WHERE o.host_organization_id = ${organization.id}
    ORDER BY 
      CASE a.status 
        WHEN 'pending' THEN 1
        WHEN 'approved' THEN 2
        WHEN 'rejected' THEN 3
        ELSE 4
      END,
      a.created_at DESC
  `

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

  const pendingCount = applications.filter((app) => app.status === "pending").length
  const approvedCount = applications.filter((app) => app.status === "approved").length
  const rejectedCount = applications.filter((app) => app.status === "rejected").length

  return (
    <>
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground">Review and manage applications to your opportunities</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
              <p className="text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        {applications.length > 0 ? (
          <div className="grid gap-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <CardTitle className="text-xl">{application.opportunity_title}</CardTitle>
                        <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                      </div>
                      <CardDescription className="flex flex-wrap gap-4">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {application.full_name || "Name not provided"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {application.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {application.volunteer_country || "Country not provided"}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm font-medium">Availability</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {application.availability_start && application.availability_end ? (
                          <>
                            {new Date(application.availability_start).toLocaleDateString()} -{" "}
                            {new Date(application.availability_end).toLocaleDateString()}
                          </>
                        ) : (
                          "Not specified"
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">Applied</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(application.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {application.motivation && (
                    <div className="mb-4">
                      <p className="mb-1 text-sm font-medium">Motivation</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{application.motivation}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link href={`/host/applications/${application.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No applications yet</h3>
              <p className="mb-4 text-center text-muted-foreground">
                Applications to your opportunities will appear here
              </p>
              <Link href="/host/opportunities/new">
                <Button>Post an Opportunity</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
