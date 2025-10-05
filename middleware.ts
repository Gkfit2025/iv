import { stackServerApp } from "@/stack"
import { StackMiddleware } from "@stackframe/stack/dist/lib/stack-middleware"

export default StackMiddleware(stackServerApp, {
  // Redirect authenticated users away from auth pages
  signedInRedirectPath: "/dashboard",
  // Redirect unauthenticated users to login
  signedOutRedirectPath: "/auth/login",
})

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
