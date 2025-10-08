import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    console.log("[v0] /api/profile PUT - starting")

    const session = await getSession()
    if (!session) {
      console.log("[v0] /api/profile - no session")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.id
    console.log("[v0] /api/profile - user ID from session:", userId)

    const body = await request.json()
    const { full_name, phone, country, bio } = body

    console.log("[v0] /api/profile - updating profile for user:", userId)

    // Check if profile exists
    const existingProfile = await sql`
      SELECT id FROM public.profiles WHERE user_id = ${userId} LIMIT 1
    `

    if (existingProfile.length > 0) {
      // Update existing profile
      await sql`
        UPDATE public.profiles
        SET 
          full_name = ${full_name},
          phone = ${phone},
          country = ${country},
          bio = ${bio || null},
          updated_at = NOW()
        WHERE user_id = ${userId}
      `
      console.log("[v0] /api/profile - profile updated")
    } else {
      // Create new profile
      await sql`
        INSERT INTO public.profiles (user_id, full_name, phone, country, bio)
        VALUES (${userId}, ${full_name}, ${phone}, ${country}, ${bio || null})
      `
      console.log("[v0] /api/profile - profile created")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] /api/profile error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update profile" },
      { status: 500 },
    )
  }
}
