import { neon, neonConfig } from "@neondatabase/serverless"

neonConfig.fetchConnectionCache = true

const databaseUrl =
  process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.iv_POSTGRES_URL || process.env.iv_DATABASE_URL

if (!databaseUrl) {
  throw new Error("Database URL not found in environment variables")
}

export const sql = neon(databaseUrl)

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
