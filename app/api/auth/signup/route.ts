import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { sql } from "@/lib/db"
import { encrypt } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    console.log("[v0] Signup attempt for:", email)

    const existingUsers = await sql`
      SELECT id FROM public.users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hash(password, 10)

    console.log("[v0] Creating user in database")
    const newUsers = await sql`
      INSERT INTO public.users (email, password_hash, created_at, updated_at)
      VALUES (${email}, ${passwordHash}, NOW(), NOW())
      RETURNING id, email
    `

    const user = newUsers[0]
    console.log("[v0] User created with ID:", user.id)

    console.log("[v0] Creating profile for user")
    await sql`
      INSERT INTO public.profiles (user_id, full_name, created_at, updated_at)
      VALUES (${user.id}, ${fullName}, NOW(), NOW())
    `
    console.log("[v0] Profile created successfully")

    const sessionToken = await encrypt({
      id: user.id,
      email: user.email,
      full_name: fullName,
    })

    console.log("[v0] Setting session cookie for new user:", user.id)
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
    console.error("[v0] Signup error details:", error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Signup failed",
      },
      { status: 500 },
    )
  }
}
