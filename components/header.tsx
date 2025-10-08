"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, checkAuth } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        await checkAuth() // Refresh auth state
        router.push("/") // Redirect to home
      }
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/gkf-logo.webp" alt="GKF Logo" width={40} height={40} className="h-10 w-10 object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-bold leading-tight">IV</span>
            <span className="hidden text-xs text-muted-foreground sm:inline leading-tight">Interns & Volunteers</span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/opportunities">
            <Button variant="ghost">Find Opportunities</Button>
          </Link>
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <UserNav />
              <Button variant="outline" onClick={handleSignOut} size="sm">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button variant="default">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
