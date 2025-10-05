import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"
import { hash } from "bcryptjs"
import { sql } from "@/lib/db"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key")

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    console.log("[v0] Signup attempt for email:", email)

    const existingProfiles = await sql`
      SELECT id FROM profiles WHERE id = ${email}::uuid
    `

    if (existingProfiles.length > 0) {
      console.log("[v0] User already exists")
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hash(password, 10)
    console.log("[v0] Password hashed successfully")

    // Note: This is a workaround since we don't have a users table yet
    const newProfiles = await sql`
      INSERT INTO profiles (id, full_name, bio, created_at, updated_at)
      VALUES (gen_random_uuid(), ${fullName}, ${passwordHash}, NOW(), NOW())
      RETURNING id, full_name
    `

    const profile = newProfiles[0]
    console.log("[v0] Profile created:", profile.id)

    const token = await new SignJWT({ userId: profile.id, email: email, fullName: profile.full_name })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET)

    // Set cookie
    const response = NextResponse.json({
      user: { id: profile.id, email: email, fullName: profile.full_name },
    })

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log("[v0] Signup successful")
    return response
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Signup failed" }, { status: 500 })
  }
}
