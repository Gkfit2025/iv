import { type NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { sql } from "@/lib/db"
import { encrypt } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for:", email)

    const users = await sql`
      SELECT u.id, u.email, u.password_hash, p.full_name 
      FROM public.users u
      LEFT JOIN public.profiles p ON p.user_id = u.id
      WHERE u.email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isValid = await compare(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const sessionToken = await encrypt({
      id: user.id,
      email: user.email,
      full_name: user.full_name || "",
    })

    console.log("[v0] Setting session cookie for user:", user.id)
    console.log("[v0] Session token length:", sessionToken.length)

    const response = NextResponse.json({
      user: { id: user.id, email: user.email },
    })

    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    console.log("[v0] Cookie set on response")

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
