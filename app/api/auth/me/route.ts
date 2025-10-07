import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const profileResult = await sql`
      SELECT full_name FROM public.profiles WHERE user_id = ${session.id}
    `

    const full_name = profileResult.rows[0]?.full_name || ""

    return NextResponse.json({
      user: {
        id: session.id,
        email: session.email,
        full_name,
      },
    })
  } catch (error) {
    console.error("[v0] Auth check error:", error)
    return NextResponse.json({ error: "Authentication check failed" }, { status: 500 })
  }
}
