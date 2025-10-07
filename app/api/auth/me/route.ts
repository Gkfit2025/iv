import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] /api/auth/me - starting auth check")

    const session = await getSession()
    console.log("[v0] /api/auth/me - session:", session)

    if (!session) {
      console.log("[v0] /api/auth/me - no session found")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log("[v0] /api/auth/me - fetching profile for user:", session.id)

    const profileResult = await sql`
      SELECT full_name FROM public.profiles WHERE user_id = ${session.id}
    `

    console.log("[v0] /api/auth/me - profile result:", profileResult.rows)

    const full_name = profileResult.rows[0]?.full_name || ""

    const userData = {
      id: session.id,
      email: session.email,
      full_name,
    }

    console.log("[v0] /api/auth/me - returning user data:", userData)

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error("[v0] /api/auth/me - error:", error)
    console.error("[v0] /api/auth/me - error stack:", error instanceof Error ? error.stack : "no stack")
    return NextResponse.json({ error: "Authentication check failed" }, { status: 500 })
  }
}
