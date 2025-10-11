import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function GET() {
  console.log("[v0] Email test - starting")

  try {
    // Check if API key exists
    const apiKey = process.env.RESEND_API_KEY
    console.log("[v0] Email test - API key exists:", !!apiKey)
    console.log("[v0] Email test - API key length:", apiKey?.length || 0)
    console.log("[v0] Email test - API key prefix:", apiKey?.substring(0, 7) || "none")

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY environment variable is not set",
          envVars: {
            RESEND_API_KEY: !!process.env.RESEND_API_KEY,
            NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
          },
        },
        { status: 500 },
      )
    }

    // Try to create Resend client
    console.log("[v0] Email test - creating Resend client")
    const resend = new Resend(apiKey)
    console.log("[v0] Email test - Resend client created successfully")

    // Try to send a test email
    console.log("[v0] Email test - attempting to send email")
    const result = await resend.emails.send({
      from: "IV Volunteers <onboarding@resend.dev>",
      to: "rafique@the-constellation.org",
      subject: "Test Email from GKF IV",
      html: "<p>This is a test email to verify Resend integration is working.</p>",
    })

    console.log("[v0] Email test - email sent successfully:", result)

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      result,
      envVars: {
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
      },
    })
  } catch (error: any) {
    console.error("[v0] Email test - error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        envVars: {
          RESEND_API_KEY: !!process.env.RESEND_API_KEY,
          NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
        },
      },
      { status: 500 },
    )
  }
}
