import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { StackProvider } from "@stackframe/stack"
import { stackServerApp } from "@/stack"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "IV - Interns & Volunteers",
  description: "Connect with meaningful volunteer opportunities around the world",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <StackProvider app={stackServerApp}>
          <Suspense fallback={null}>{children}</Suspense>
        </StackProvider>
      </body>
    </html>
  )
}
