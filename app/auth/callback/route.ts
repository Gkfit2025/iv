import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"

  if (code) {
    const supabase = createClient()

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to the dashboard or specified next URL
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }

    console.error("[v0] Auth callback error:", error)
  }

  // If there's an error or no code, redirect to login
  return NextResponse.redirect(new URL("/auth/login?error=verification_failed", requestUrl.origin))
}
