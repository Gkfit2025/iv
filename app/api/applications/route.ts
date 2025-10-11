import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { sendEmail, getApplicationConfirmationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    console.log("[v0] /api/applications POST - starting")
    console.log("[v0] /api/applications - Environment check:")
    console.log("[v0] - RESEND_API_KEY present:", !!process.env.RESEND_API_KEY)
    console.log("[v0] - NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL)

    const session = await getSession()
    if (!session) {
      console.log("[v0] /api/applications - no session")
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

    console.log("[v0] /api/applications - creating application for opportunity:", opportunity_id)

    // Check if user has already applied
    const existingApplication = await sql`
      SELECT id FROM public.applications
      WHERE user_id = ${user_id} AND opportunity_id = ${opportunity_id}
      LIMIT 1
    `

    if (existingApplication.length > 0) {
      console.log("[v0] /api/applications - user already applied")
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

    console.log("[v0] /api/applications - application created successfully")

    console.log("[v0] /api/applications - preparing to send confirmation email")
    console.log("[v0] /api/applications - recipient email:", email)

    try {
      const emailContent = getApplicationConfirmationEmail({
        applicantName: full_name,
        opportunityTitle: opportunity_title,
        hostOrganization: host_organization,
      })

      console.log("[v0] /api/applications - email content prepared, subject:", emailContent.subject)
      console.log("[v0] /api/applications - calling sendEmail function...")

      const emailResult = await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      })

      console.log("[v0] /api/applications - sendEmail returned:", JSON.stringify(emailResult, null, 2))

      if (emailResult.success) {
        console.log("[v0] /api/applications - ✅ confirmation email sent successfully")
      } else {
        console.warn("[v0] /api/applications - ❌ failed to send confirmation email:", emailResult.error)
      }
    } catch (emailError) {
      // Don't fail the application if email fails
      console.error("[v0] /api/applications - ❌ email exception caught:", emailError)
      console.error("[v0] /api/applications - email error type:", emailError?.constructor?.name)
      console.error(
        "[v0] /api/applications - email error message:",
        emailError instanceof Error ? emailError.message : String(emailError),
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] /api/applications error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit application" },
      { status: 500 },
    )
  }
}
