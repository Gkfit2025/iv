import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">IV</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">International Volunteers</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/opportunities">
            <Button variant="ghost">Find Opportunities</Button>
          </Link>
          <Link href="/join-ivy">
            <Button variant="default">Join IVY</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
