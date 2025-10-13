import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HostOrganizationForm } from "@/components/host-organization-form"
import { Header } from "@/components/header"

export default async function HostProfilePage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch host organization profile
  const organizations = await sql`
    SELECT * FROM public.host_organizations WHERE user_id = ${user.id}
  `
  const organization = organizations[0] || null

  return (
    <>
      <Header />
      <div className="container max-w-2xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Organization Profile</h1>
          <p className="text-muted-foreground">
            {organization
              ? "Manage your organization information"
              : "Create your organization profile to start posting opportunities"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
            <CardDescription>This information will be displayed to volunteers browsing opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <HostOrganizationForm user={user} organization={organization} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
