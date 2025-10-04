import { createClient } from "@/lib/supabase/server"
import { sendEmail, getWelcomeEmail } from "@/lib/email"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    const supabase = await createClient()

    // Get user details
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

    const {
      data: { user },
    } = await supabase.auth.admin.getUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Send welcome email
    const emailContent = getWelcomeEmail({
      name: profile?.full_name || user.email?.split("@")[0] || "Volunteer",
      email: user.email || "",
    })

    await sendEmail({
      to: user.email || "",
      subject: emailContent.subject,
      html: emailContent.html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error sending welcome email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
