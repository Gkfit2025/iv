import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Compass, Heart, Users, Globe, Award, Building2 } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">
              About Interns & Volunteers (IV)
            </h1>
            <p className="text-pretty text-lg text-muted-foreground md:text-xl">
              Connecting passionate individuals with meaningful opportunities to create lasting impact across the globe
            </p>
          </div>
        </div>
      </section>

      <div className="container py-16 md:py-24">
        {/* Vision Section */}
        <section className="mb-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Our Vision</h2>
            </div>
            <Card>
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  To build a global community where individuals from diverse backgrounds come together to address the
                  world's most pressing challenges. We envision a future where every person has the opportunity to
                  contribute their skills, passion, and energy toward creating positive change, fostering cross-cultural
                  understanding, and building a more equitable and compassionate world.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <Card>
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                  The International Volunteers (IV) program connects skilled and passionate volunteers with verified
                  organizations worldwide that are making a difference in their communities. Our mission is to:
                </p>
                <ul className="space-y-4">
                  {[
                    "Facilitate meaningful volunteer placements that create lasting impact",
                    "Support organizations in achieving their social and humanitarian goals",
                    "Provide volunteers with transformative experiences that foster personal and professional growth",
                    "Build bridges between cultures and promote global citizenship",
                    "Ensure safe, ethical, and rewarding volunteer experiences for all participants",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* GKF Section */}
        <section className="mb-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Building2 className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-3xl font-bold">Facilitated by Grace Kennett Foundation</h2>
            </div>
            <Card>
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-4">
                  <Image
                    src="/gkf-logo.webp"
                    alt="Grace Kennett Foundation Logo"
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">Grace Kennett Foundation</h3>
                    <p className="text-sm text-muted-foreground">80+ Years of Service</p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                  Grace Kennett Foundation is a non-governmental organization with a glorious 80-year history. Our work
                  has saved the lives of thousands of victims of female infanticide and abandoned children. A thousand
                  happy families have been built through adoption.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                  Founded in 1947 by Dr. Grace A. Kennett, an orphan herself and a friend of all, especially of the sick
                  and the underprivileged, GKF was established as a Foundation under the Societies Registration Act in
                  1978. We address the physical, mental, and social well-being of the community through comprehensive
                  healthcare and allied services.
                </p>
                <div className="rounded-lg bg-muted p-6">
                  <h4 className="mb-3 font-semibold">GKF's Vision</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    To build a child-friendly society where even severely disadvantaged children develop their full
                    potential as individuals, as members of their families and communities, and to address the physical,
                    mental and social well-being of the community through comprehensive healthcare and allied services.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href="https://gkfmadurai.in/about-us/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Learn more about Grace Kennett Foundation →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="mb-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Our Core Values</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <Heart className="h-5 w-5 text-primary" />
                    Compassion
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We approach every interaction with empathy and understanding, recognizing the dignity and worth of
                    every individual.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <Users className="h-5 w-5 text-primary" />
                    Community
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We believe in the power of collective action and foster strong connections between volunteers,
                    organizations, and communities.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <Globe className="h-5 w-5 text-primary" />
                    Global Citizenship
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We promote cross-cultural understanding and encourage volunteers to think globally while acting
                    locally.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <Award className="h-5 w-5 text-primary" />
                    Excellence
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We maintain high standards in all our operations, ensuring quality experiences and meaningful impact
                    for all stakeholders.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold">How IV Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    1
                  </div>
                  <h3 className="mb-3 font-semibold">Discover Opportunities</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse hundreds of verified volunteer opportunities across different countries, causes, and skill
                    requirements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    2
                  </div>
                  <h3 className="mb-3 font-semibold">Apply & Connect</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit your application and connect directly with host organizations to discuss your placement and
                    expectations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    3
                  </div>
                  <h3 className="mb-3 font-semibold">Make an Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Begin your volunteer journey, contribute your skills, and create lasting positive change in
                    communities worldwide.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section>
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Our Impact</h2>
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-8">
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold text-primary">50+</div>
                    <div className="text-sm text-muted-foreground">Countries Worldwide</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold text-primary">1000+</div>
                    <div className="text-sm text-muted-foreground">Active Volunteers</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold text-primary">200+</div>
                    <div className="text-sm text-muted-foreground">Partner Organizations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
