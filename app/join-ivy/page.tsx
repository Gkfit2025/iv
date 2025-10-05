"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Globe, Heart, CheckCircle2 } from "lucide-react"

export default function JoinIVYPage() {
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    phone: "",
    country: "",
    website: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In MVP, this would redirect to Google Form
    // For now, we'll just show an alert
    alert("Thank you for your interest! We will contact you soon.")
    console.log("[v0] Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/10 to-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">Join the IVY Network</h1>
            <p className="text-pretty text-lg text-muted-foreground md:text-xl">
              Connect with passionate volunteers worldwide and grow your organization's impact. Become a verified host
              organization today.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12 flex-1">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Benefits Section */}
          <div>
            <h2 className="mb-6 text-2xl font-bold">Why Join IVY?</h2>

            <div className="space-y-6">
              <Card>
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Access Global Talent Pool</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with skilled and passionate volunteers from around the world eager to support your
                      mission.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                    <Globe className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Increase Your Visibility</h3>
                    <p className="text-sm text-muted-foreground">
                      Showcase your organization and opportunities to thousands of potential volunteers actively
                      searching.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Verified Badge</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn trust with our verification badge, showing volunteers your organization meets our quality
                      standards.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Streamlined Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage applications, communicate with volunteers, and track your impact all in one place.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 font-semibold">What We Look For:</h3>
              <ul className="space-y-2">
                {[
                  "Registered non-profit or social enterprise",
                  "Clear mission and impact goals",
                  "Safe and supportive environment for volunteers",
                  "Commitment to volunteer welfare and development",
                  "Transparent operations and communication",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Application Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Apply to Join</CardTitle>
                <CardDescription>Fill out this form and we'll get back to you within 48 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      required
                      placeholder="Your organization's name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="contact@organization.org"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      placeholder="Where is your organization based?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourorganization.org"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Tell Us About Your Organization *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      placeholder="Describe your mission, activities, and why you want to host volunteers..."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Submit Application
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    By submitting, you agree to our terms and conditions
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
