import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Checking database tables...")

    // Get all tables in the public schema
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    console.log("[v0] Tables found:", tables)

    // Get database name
    const dbInfo = await sql`SELECT current_database()`

    return NextResponse.json({
      success: true,
      database: dbInfo[0]?.current_database,
      tables: tables.map((t) => t.table_name),
      tableCount: tables.length,
    })
  } catch (error) {
    console.error("[v0] Database check error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Database check failed",
        details: error,
      },
      { status: 500 },
    )
  }
}
