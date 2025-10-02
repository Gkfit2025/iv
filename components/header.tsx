import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/gkf-logo.webp" alt="GKF Logo" width={40} height={40} className="h-10 w-10 object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-bold leading-tight">IV</span>
            <span className="hidden text-xs text-muted-foreground sm:inline leading-tight">
              Internship & Volunteer Program
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/opportunities">
            <Button variant="ghost">Find Opportunities</Button>
          </Link>
          <Link href="/join-ivy">
            <Button variant="default">Host IV</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
