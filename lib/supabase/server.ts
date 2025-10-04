import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

/**
 * Creates a Supabase client for server-side operations
 */
export async function createClient() {
  const cookieStore = await cookies()

  // Get the auth token from cookies
  const authToken = cookieStore.get("sb-access-token")?.value

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {},
    },
  })
}
