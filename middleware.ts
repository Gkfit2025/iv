import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { stackServerApp } from "@/stack"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the user from Stack Auth
  const user = await stackServerApp.getUser()

  // Auth pages - redirect if already logged in
  if (pathname.startsWith("/auth/")) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.next()
  }

  // Protected routes - redirect if not logged in
  const protectedRoutes = ["/dashboard", "/profile", "/applications"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
