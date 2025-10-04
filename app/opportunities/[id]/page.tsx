import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, Users, Star, CheckCircle2, Gift, Shield } from "lucide-react"
import { opportunities, hostOrganizations, reviews } from "@/lib/mock-data"
import { createClient } from "@/lib/supabase/server"

export default async function OpportunityDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const opportunity = opportunities.find((opp) => opp.id === params.id)

  if (!opportunity) {
    notFound()
  }

  const host = hostOrganizations.find((h) => h.id === opportunity.hostId)
  const opportunityReviews = reviews.filter((r) => r.opportunityId === opportunity.id)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let hasApplied = false
  if (user) {
    const { data: existingApplication } = await supabase
      .from("applications")
      .select("id")
      .eq("user_id", user.id)
      .eq("opportunity_id", opportunity.id)
      .single()

    hasApplied = !!existingApplication
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-8 flex-1">
        {/* Image Gallery */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:col-span-2">
            <Image
              src={opportunity.images[0] || "/placeholder.svg"}
              alt={opportunity.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {opportunity.images.slice(1, 3).map((image, idx) => (
            <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={image || "/placeholder.svg"}
                alt={`${opportunity.title} ${idx + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {opportunity.theme.map((theme) => (
                  <Badge key={theme} variant="secondary" className="capitalize">
                    {theme}
                  </Badge>
                ))}
                {opportunity.featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
              </div>

              <h1 className="mb-4 text-balance text-3xl font-bold md:text-4xl">{opportunity.title}</h1>

              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>
                    {opportunity.minDuration}-{opportunity.maxDuration} weeks
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="capitalize">{opportunity.applicantTypes.join(" / ")}</span>
                </div>
              </div>
            </div>

            {/* Host Organization */}
            {host && (
              <Card className="mb-6">
                <CardContent className="flex items-center gap-4 p-6">
                  <Image
                    src={host.logo || "/placeholder.svg"}
                    alt={host.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold">{host.name}</h3>
                      {host.verified && (
                        <Badge variant="secondary" className="gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">{host.description}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium">{host.rating}</span>
                      <span className="text-muted-foreground">({host.reviewCount} reviews)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About This Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-pretty leading-relaxed">{opportunity.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {opportunity.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What You'll Get</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {opportunity.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Gift className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews */}
            {opportunityReviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {opportunityReviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="mb-2 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={review.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{review.volunteerName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.volunteerName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "fill-accent text-accent" : "text-muted"}`}
                                />
                              ))}
                            </div>
                            <span>•</span>
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="mb-2 text-sm text-muted-foreground">Duration Range</p>
                  <p className="text-2xl font-bold">
                    {opportunity.minDuration}-{opportunity.maxDuration} weeks
                  </p>
                </div>

                <div className="mb-6">
                  <p className="mb-2 text-sm text-muted-foreground">Accepting Applications From</p>
                  <div className="flex gap-2">
                    {opportunity.applicantTypes.map((type) => (
                      <Badge key={type} variant="outline" className="capitalize">
                        {type}s
                      </Badge>
                    ))}
                  </div>
                </div>

                {user ? (
                  hasApplied ? (
                    <div className="space-y-2">
                      <Button className="w-full" size="lg" disabled>
                        Already Applied
                      </Button>
                      <Link href="/dashboard">
                        <Button variant="outline" className="w-full bg-transparent" size="lg">
                          View Application
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Link href={`/opportunities/${opportunity.id}/apply`}>
                      <Button className="w-full" size="lg">
                        Apply Now
                      </Button>
                    </Link>
                  )
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth/sign-up">
                      <Button className="w-full" size="lg">
                        Sign Up to Apply
                      </Button>
                    </Link>
                    <Link href="/auth/login">
                      <Button variant="outline" className="w-full bg-transparent" size="lg">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  {user ? "Complete the application form" : "Create an account to apply"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
