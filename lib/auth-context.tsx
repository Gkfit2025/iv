"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  full_name?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("[v0] AuthContext - checking auth")
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        })
        console.log("[v0] AuthContext - /api/auth/me response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] AuthContext - user data received:", data)
          setUser(data.user)
        } else {
          console.log("[v0] AuthContext - not authenticated")
        }
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "Login failed")
    }

    const data = await response.json()
    console.log("[v0] AuthContext - login successful, user:", data.user)
    setUser(data.user)
  }

  const signup = async (email: string, password: string, fullName: string) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName }),
      credentials: "include",
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "Signup failed")
    }

    const data = await response.json()
    console.log("[v0] AuthContext - signup successful, user:", data.user)
    setUser(data.user)
  }

  const logout = async () => {
    console.log("[v0] AuthContext - logging out")
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
