import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { sql as vercelSql } from "@vercel/postgres"

export async function GET() {
  try {
    console.log("[v0] Testing database connection...")

    // Check environment variables
    const envVars = {
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      iv_POSTGRES_URL: !!process.env.iv_POSTGRES_URL,
      iv_DATABASE_URL: !!process.env.iv_DATABASE_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
    }

    console.log("[v0] Environment variables:", envVars)

    const results: any = {
      envVars,
      tests: [],
    }

    // Test 1: Try @vercel/postgres
    try {
      console.log("[v0] Testing @vercel/postgres...")
      const result = await vercelSql`SELECT NOW() as current_time, version() as pg_version`
      results.tests.push({
        method: "@vercel/postgres",
        success: true,
        data: result.rows[0],
      })
      console.log("[v0] @vercel/postgres: SUCCESS")
    } catch (error) {
      results.tests.push({
        method: "@vercel/postgres",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      console.log("[v0] @vercel/postgres: FAILED", error)
    }

    // Test 2: Try @neondatabase/serverless with POSTGRES_URL
    if (process.env.POSTGRES_URL) {
      try {
        console.log("[v0] Testing @neondatabase/serverless with POSTGRES_URL...")
        const sql = neon(process.env.POSTGRES_URL)
        const result = await sql`SELECT NOW() as current_time`
        results.tests.push({
          method: "@neondatabase/serverless (POSTGRES_URL)",
          success: true,
          data: result[0],
        })
        console.log("[v0] @neondatabase/serverless (POSTGRES_URL): SUCCESS")
      } catch (error) {
        results.tests.push({
          method: "@neondatabase/serverless (POSTGRES_URL)",
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
        console.log("[v0] @neondatabase/serverless (POSTGRES_URL): FAILED", error)
      }
    }

    // Test 3: Try @neondatabase/serverless with iv_POSTGRES_URL
    if (process.env.iv_POSTGRES_URL) {
      try {
        console.log("[v0] Testing @neondatabase/serverless with iv_POSTGRES_URL...")
        const sql = neon(process.env.iv_POSTGRES_URL)
        const result = await sql`SELECT NOW() as current_time`
        results.tests.push({
          method: "@neondatabase/serverless (iv_POSTGRES_URL)",
          success: true,
          data: result[0],
        })
        console.log("[v0] @neondatabase/serverless (iv_POSTGRES_URL): SUCCESS")
      } catch (error) {
        results.tests.push({
          method: "@neondatabase/serverless (iv_POSTGRES_URL)",
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
        console.log("[v0] @neondatabase/serverless (iv_POSTGRES_URL): FAILED", error)
      }
    }

    const anySuccess = results.tests.some((t: any) => t.success)

    return NextResponse.json(
      {
        success: anySuccess,
        message: anySuccess ? "At least one connection method works!" : "All connection methods failed",
        ...results,
      },
      { status: anySuccess ? 200 : 500 },
    )
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
