import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { sql } from "@/lib/db"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    const existingUsers = await sql`
      SELECT id FROM public.users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hash(password, 10)

    const newUsers = await sql`
      INSERT INTO public.users (email, password_hash, created_at, updated_at)
      VALUES (${email}, ${passwordHash}, NOW(), NOW())
      RETURNING id, email
    `

    const user = newUsers[0]

    await sql`
      INSERT INTO public.profiles (user_id, full_name, created_at, updated_at)
      VALUES (${user.id}, ${fullName}, NOW(), NOW())
    `

    await createSession({
      id: user.id,
      email: user.email,
      full_name: fullName,
    })

    return NextResponse.json({
      user: { id: user.id, email: user.email },
    })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Signup failed",
      },
      { status: 500 },
    )
  }
}
