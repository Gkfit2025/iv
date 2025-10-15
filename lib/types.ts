import type { THEMES } from "./constants"

export type ApplicantType = "volunteer" | "intern"

export type Theme = (typeof THEMES)[number]

export interface HostOrganization {
  id: string
  name: string
  description: string
  location: string
  country: string
  logo: string
  coverImage: string
  rating: number
  reviewCount: number
  verified: boolean
}

export interface Opportunity {
  id: string
  hostId: string
  title: string
  description: string
  theme: Theme[]
  location: string
  country: string
  applicantTypes: ApplicantType[]
  minDuration: number // in weeks
  maxDuration: number // in weeks
  images: string[]
  requirements: string[]
  benefits: string[]
  applicationFormUrl: string // Google Form URL
  featured: boolean
}

export interface Review {
  id: string
  opportunityId: string
  volunteerName: string
  rating: number
  comment: string
  date: string
  avatar: string
}
