import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"
import { hash } from "bcryptjs"
import { sql } from "@/lib/db"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key")

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Environment check:")
    console.log("[v0] POSTGRES_URL exists:", !!process.env.POSTGRES_URL)
    console.log("[v0] iv_POSTGRES_URL exists:", !!process.env.iv_POSTGRES_URL)
    console.log("[v0] JWT_SECRET exists:", !!process.env.JWT_SECRET)

    const { email, password, fullName } = await request.json()

    console.log("[v0] Signup attempt for email:", email)

    let existingUsers
    try {
      existingUsers = await sql`
        SELECT id FROM public.users WHERE email = ${email}
      `
      console.log("[v0] Database connection successful")
    } catch (dbError) {
      console.error("[v0] Database connection error:", dbError)
      return NextResponse.json(
        { error: "Database connection failed: " + (dbError instanceof Error ? dbError.message : "Unknown error") },
        { status: 500 },
      )
    }

    if (existingUsers.length > 0) {
      console.log("[v0] User already exists")
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hash(password, 10)
    console.log("[v0] Password hashed successfully")

    const newUsers = await sql`
      INSERT INTO public.users (email, password_hash, created_at, updated_at)
      VALUES (${email}, ${passwordHash}, NOW(), NOW())
      RETURNING id, email
    `

    const user = newUsers[0]
    console.log("[v0] User created:", user.id)

    await sql`
      INSERT INTO public.profiles (user_id, full_name, created_at, updated_at)
      VALUES (${user.id}, ${fullName}, NOW(), NOW())
    `
    console.log("[v0] Profile created for user:", user.id)

    const token = await new SignJWT({ userId: user.id, email: user.email, fullName })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET)

    // Set cookie
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, fullName },
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
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Signup failed",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
