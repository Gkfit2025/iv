import { type NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { sql } from "@/lib/db"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

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

    await createSession({
      id: user.id,
      email: user.email,
      full_name: user.full_name || "",
    })

    return NextResponse.json({
      user: { id: user.id, email: user.email },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
