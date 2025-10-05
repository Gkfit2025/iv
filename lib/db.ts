import { neon } from "@neondatabase/serverless"

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL!

export const sql = neon(databaseUrl, {
  fetchOptions: {
    cache: "no-store",
  },
})

export interface User {
  id: string
  email: string
  password_hash: string
  full_name: string
  email_verified: boolean
  created_at: Date
  updated_at: Date
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  country: string | null
  bio: string | null
  created_at: Date
  updated_at: Date
}

export interface Application {
  id: string
  user_id: string
  opportunity_id: string
  opportunity_title: string
  host_organization: string
  status: "pending" | "approved" | "rejected" | "withdrawn"
  availability_start: Date
  availability_end: Date
  motivation: string
  experience: string
  created_at: Date
  updated_at: Date
}
