import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OpportunityForm } from "@/components/opportunity-form"
import { Header } from "@/components/header"

export const dynamic = "force-dynamic"

export default async function NewOpportunityPage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if host organization exists
  const organizations = await sql`
    SELECT id FROM public.host_organizations WHERE user_id = ${user.id}
  `

  if (organizations.length === 0) {
    redirect("/host/profile")
  }

  return (
    <>
      <Header />
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Post New Opportunity</h1>
          <p className="text-muted-foreground">Create a new volunteer or internship opportunity</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Opportunity Details</CardTitle>
            <CardDescription>Fill in the information about this opportunity</CardDescription>
          </CardHeader>
          <CardContent>
            <OpportunityForm />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
