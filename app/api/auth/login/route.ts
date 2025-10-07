import { type NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { sql } from "@/lib/db"
import { encrypt } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login route - starting")

    const body = await request.json()
    console.log("[v0] Login route - body parsed")

    const { email, password } = body
    console.log("[v0] Login attempt for:", email)

    if (!email || !password) {
      console.log("[v0] Login route - missing email or password")
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    console.log("[v0] Login route - querying database")
    const users = await sql`
      SELECT u.id, u.email, u.password_hash, p.full_name 
      FROM public.users u
      LEFT JOIN public.profiles p ON p.user_id = u.id
      WHERE u.email = ${email}
    `
    console.log("[v0] Login route - query complete, found users:", users.length)

    if (users.length === 0) {
      console.log("[v0] Login route - user not found")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]
    console.log("[v0] Login route - user found:", user.id)

    // Verify password
    console.log("[v0] Login route - comparing password")
    const isValid = await compare(password, user.password_hash)
    console.log("[v0] Login route - password valid:", isValid)

    if (!isValid) {
      console.log("[v0] Login route - invalid password")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Login route - encrypting session")
    const sessionToken = await encrypt({
      id: user.id,
      email: user.email,
      full_name: user.full_name || "",
    })
    console.log("[v0] Login route - session encrypted, token length:", sessionToken.length)

    console.log("[v0] Login route - creating response")
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, full_name: user.full_name },
    })

    console.log("[v0] Login route - setting cookie")
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    console.log("[v0] Login route - success, returning response")
    return response
  } catch (error) {
    console.error("[v0] Login error - full error:", error)
    console.error("[v0] Login error - message:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Login error - stack:", error instanceof Error ? error.stack : "no stack")
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed" }, { status: 500 })
  }
}
