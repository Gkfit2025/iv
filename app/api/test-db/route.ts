import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    console.log("[v0] Testing database connection...")

    // Check environment variables
    const envVars = {
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      iv_POSTGRES_URL: !!process.env.iv_POSTGRES_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
    }

    console.log("[v0] Environment variables:", envVars)

    // Try to connect with different env vars
    const dbUrl = process.env.POSTGRES_URL || process.env.iv_POSTGRES_URL || process.env.DATABASE_URL

    if (!dbUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "No database URL found",
          envVars,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Using database URL (first 20 chars):", dbUrl.substring(0, 20))

    const sql = neon(dbUrl)

    // Test query
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`

    console.log("[v0] Database connection successful!")

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      envVars,
      dbInfo: result[0],
    })
  } catch (error) {
    console.error("[v0] Database test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
