"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

interface ApplicationReviewActionsProps {
  applicationId: string
}

export function ApplicationReviewActions({ applicationId }: ApplicationReviewActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStatusUpdate = async (status: "approved" | "rejected") => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update application")
      }

      router.refresh()
      router.push("/host/applications")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      <div className="flex gap-4">
        <Button
          onClick={() => handleStatusUpdate("approved")}
          disabled={isLoading}
          size="lg"
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle2 className="mr-2 h-5 w-5" />
          Approve Application
        </Button>
        <Button
          onClick={() => handleStatusUpdate("rejected")}
          disabled={isLoading}
          size="lg"
          variant="destructive"
          className="flex-1"
        >
          <XCircle className="mr-2 h-5 w-5" />
          Reject Application
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        The applicant will be notified of your decision via email
      </p>
    </div>
  )
}
