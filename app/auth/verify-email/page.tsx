import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription>We&apos;ve sent you a verification link to confirm your email address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted p-4 text-sm">
              <p className="mb-2 font-medium">Next steps:</p>
              <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
                <li>Check your email inbox</li>
                <li>Click the verification link</li>
                <li>Return here to sign in</li>
              </ol>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Already verified?{" "}
              <Link href="/auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
