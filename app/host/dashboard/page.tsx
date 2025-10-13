import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Building2, Plus, FileText, MapPin, Users } from "lucide-react"
import { Header } from "@/components/header"

export default async function HostDashboardPage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch host organization
  const organizations = await sql`
    SELECT * FROM public.host_organizations WHERE user_id = ${user.id}
  `
  const organization = organizations[0]

  // If no organization exists, redirect to create profile
  if (!organization) {
    redirect("/host/profile")
  }

  // Fetch opportunities for this organization
  const opportunities = await sql`
    SELECT * FROM public.opportunities 
    WHERE host_organization_id = ${organization.id}
    ORDER BY created_at DESC
  `

  // Fetch applications to this organization's opportunities
  const applications = await sql`
    SELECT a.*, o.title as opportunity_title
    FROM public.applications a
    JOIN public.opportunities o ON a.opportunity_uuid = o.id
    WHERE o.host_organization_id = ${organization.id}
    ORDER BY a.created_at DESC
  `

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "paused":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "closed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    }
  }

  return (
    <>
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {organization.name}</h1>
          <p className="text-muted-foreground">Manage your opportunities and applications</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Organization Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{organization.verified ? "Verified ✓" : "Pending Verification"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="font-medium">
                  {organization.rating.toFixed(1)} / 5.0 ({organization.review_count} reviews)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">
                  {organization.location}, {organization.country}
                </p>
              </div>
              <Link href="/host/profile">
                <Button variant="outline" className="w-full bg-transparent">
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Opportunities Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">{opportunities.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {opportunities.filter((opp) => opp.status === "active").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
              <Link href="/host/opportunities/new">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Opportunity
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Applications Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {applications.filter((app) => app.status === "pending").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
              <Link href="/host/applications">
                <Button variant="outline" className="w-full bg-transparent">
                  <Users className="mr-2 h-4 w-4" />
                  Review Applications
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Opportunities List */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Opportunities</h2>
            <Link href="/host/opportunities/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Post New
              </Button>
            </Link>
          </div>

          {opportunities.length > 0 ? (
            <div className="grid gap-4">
              {opportunities.map((opportunity) => (
                <Card key={opportunity.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {opportunity.location}, {opportunity.country}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(opportunity.status)}>{opportunity.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{opportunity.description}</p>
                    <div className="flex gap-2">
                      <Link href={`/host/opportunities/${opportunity.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/opportunities/${opportunity.id}`}>
                        <Button variant="outline" size="sm">
                          View Public Page
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
                <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No opportunities yet</h3>
                <p className="mb-4 text-center text-muted-foreground">
                  Start connecting with volunteers by posting your first opportunity
                </p>
                <Link href="/host/opportunities/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Post Your First Opportunity
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
