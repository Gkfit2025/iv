import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OpportunityForm } from "@/components/opportunity-form"
import { Header } from "@/components/header"

export default async function EditOpportunityPage({ params }: { params: { id: string } }) {
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

  // Fetch opportunity and verify ownership
  const opportunities = await sql`
    SELECT * FROM public.opportunities
    WHERE id = ${params.id} AND host_organization_id = ${organizations[0].id}
  `

  if (opportunities.length === 0) {
    notFound()
  }

  return (
    <>
      <Header />
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Opportunity</h1>
          <p className="text-muted-foreground">Update the details of this opportunity</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Opportunity Details</CardTitle>
            <CardDescription>Make changes to your opportunity information</CardDescription>
          </CardHeader>
          <CardContent>
            <OpportunityForm opportunity={opportunities[0]} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
