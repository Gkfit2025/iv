import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Heart, Users, Award } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">
              Make a Difference Around the World
            </h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              Connect with meaningful volunteer opportunities across the globe. Join International Volunteers and create
              lasting impact while experiencing new cultures.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/opportunities">
                <Button size="lg" className="w-full sm:w-auto">
                  Find Opportunities
                </Button>
              </Link>
              <Link href="/join-ivy">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Join as Host Organization
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Choose IV?</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Global Reach</h3>
                <p className="text-sm text-muted-foreground">
                  Opportunities in over 50 countries across all continents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Heart className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mb-2 font-semibold">Verified Organizations</h3>
                <p className="text-sm text-muted-foreground">
                  All host organizations are carefully vetted and verified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold">Community Support</h3>
                <p className="text-sm text-muted-foreground">Join a community of passionate volunteers worldwide</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Meaningful Impact</h3>
                <p className="text-sm text-muted-foreground">Create lasting change in communities that need it most</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">Ready to Start Your Journey?</h2>
            <p className="mb-8 text-pretty text-lg opacity-90">
              Browse hundreds of volunteer opportunities and find the perfect match for your skills and interests.
            </p>
            <Link href="/opportunities">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
