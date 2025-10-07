import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MapPin, Building2, FileText, User } from "lucide-react"
import { Header } from "@/components/header"

export default async function DashboardPage() {
  console.log("[v0] Dashboard: Starting to load")

  let user
  try {
    user = await getSession()
    console.log("[v0] Dashboard: Session loaded", user ? "User found" : "No user")
  } catch (error) {
    console.error("[v0] Dashboard: Error getting session", error)
    redirect("/auth/login")
  }

  if (!user) {
    console.log("[v0] Dashboard: No user, redirecting to login")
    redirect("/auth/login")
  }

  console.log("[v0] Dashboard: Fetching profile for user", user.id)

  // Fetch user profile
  let profile
  try {
    const profiles = await sql`
      SELECT * FROM public.profiles WHERE user_id = ${user.id}
    `
    profile = profiles[0]
    console.log("[v0] Dashboard: Profile loaded", profile ? "Found" : "Not found")
  } catch (error) {
    console.error("[v0] Dashboard: Error fetching profile", error)
  }

  // Fetch user applications
  let applications
  try {
    applications = await sql`
      SELECT * FROM public.applications 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `
    console.log("[v0] Dashboard: Applications loaded", applications?.length || 0)
  } catch (error) {
    console.error("[v0] Dashboard: Error fetching applications", error)
    applications = []
  }

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
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || user.email}</h1>
          <p className="text-muted-foreground">Manage your volunteer applications and profile</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {profile?.full_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{profile.full_name}</p>
                </div>
              )}
              {profile?.country && (
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-medium">{profile.country}</p>
                </div>
              )}
              <Link href="/profile">
                <Button variant="outline" className="w-full bg-transparent">
                  Edit Profile
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
                  <p className="text-2xl font-bold">{applications?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {applications?.filter((app) => app.status === "pending").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {applications?.filter((app) => app.status === "approved").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {applications?.filter((app) => app.status === "rejected").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
              <Link href="/opportunities">
                <Button className="w-full">Browse Opportunities</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/opportunities">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MapPin className="mr-2 h-4 w-4" />
                  Find Opportunities
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <User className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Your Applications</h2>
          {applications && applications.length > 0 ? (
            <div className="grid gap-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{application.opportunity_title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {application.host_organization}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {application.availability_start && application.availability_end && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(application.availability_start).toLocaleDateString()} -{" "}
                          {new Date(application.availability_end).toLocaleDateString()}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        Applied: {new Date(application.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    {application.motivation && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">Motivation</p>
                        <p className="text-sm text-muted-foreground">{application.motivation}</p>
                      </div>
                    )}
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
                  Start your volunteer journey by browsing available opportunities
                </p>
                <Link href="/opportunities">
                  <Button>Browse Opportunities</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
