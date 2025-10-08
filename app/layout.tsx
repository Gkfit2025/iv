import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth-context"
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
  openGraph: {
    title: "IV - Interns & Volunteers",
    description: "Connect with meaningful volunteer opportunities around the world",
    url: "https://gkfiv.vercel.app",
    siteName: "IV - Interns & Volunteers",
    images: [
      {
        url: "/gkf-logo.webp",
        width: 1200,
        height: 630,
        alt: "GKF - Grace Kennett Foundation Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IV - Interns & Volunteers",
    description: "Connect with meaningful volunteer opportunities around the world",
    images: ["/gkf-logo.webp"],
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
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
