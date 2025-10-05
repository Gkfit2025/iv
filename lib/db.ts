import { neon } from "@neondatabase/serverless"

// Try multiple environment variable names in order of preference
const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.iv_POSTGRES_URL ||
  process.env.iv_DATABASE_URL ||
  ""

if (!connectionString) {
  throw new Error(
    "No database connection string found. Please set POSTGRES_URL, DATABASE_URL, or iv_POSTGRES_URL environment variable.",
  )
}

// Create SQL client with Neon
export const sql = neon(connectionString)

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
