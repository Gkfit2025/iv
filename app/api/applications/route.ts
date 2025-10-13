import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { sendEmail, getApplicationConfirmationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      user_id,
      opportunity_id,
      opportunity_title,
      host_organization,
      full_name,
      email,
      phone,
      country,
      applicant_type,
      availability_start,
      availability_end,
      duration_weeks,
      motivation,
      relevant_experience,
      skills,
    } = body

    // Check if user has already applied
    const existingApplication = await sql`
      SELECT id FROM public.applications
      WHERE user_id = ${user_id} AND opportunity_id = ${opportunity_id}
      LIMIT 1
    `

    if (existingApplication.length > 0) {
      return NextResponse.json({ error: "You have already applied to this opportunity" }, { status: 400 })
    }

    // Create application with all the form data stored in a JSON column
    const applicationData = {
      opportunity_title,
      host_organization,
      full_name,
      email,
      phone,
      country,
      applicant_type,
      availability_start,
      availability_end,
      duration_weeks,
      motivation,
      relevant_experience,
      skills,
    }

    await sql`
      INSERT INTO public.applications (
        user_id,
        opportunity_id,
        status,
        cover_letter
      )
      VALUES (
        ${user_id},
        ${opportunity_id},
        'pending',
        ${JSON.stringify(applicationData)}
      )
    `

    // Send confirmation email
    try {
      const emailContent = getApplicationConfirmationEmail({
        applicantName: full_name,
        opportunityTitle: opportunity_title,
        hostOrganization: host_organization,
      })

      await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      })
    } catch (emailError) {
      // Don't fail the application if email fails
      console.error("Failed to send confirmation email:", emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting application:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit application" },
      { status: 500 },
    )
  }
}
