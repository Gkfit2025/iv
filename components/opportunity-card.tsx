import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Clock, Users } from "lucide-react"
import type { Opportunity } from "@/lib/types"
import { hostOrganizations } from "@/lib/mock-data"

interface OpportunityCardProps {
  opportunity: Opportunity
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const host = hostOrganizations.find((h) => h.id === opportunity.hostId)

  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={opportunity.images[0] || "/placeholder.svg"}
            alt={opportunity.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {opportunity.featured && (
            <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">Featured</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-balance font-semibold leading-tight">{opportunity.title}</h3>
          </div>

          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>

          {host && (
            <div className="mb-3 flex items-center gap-2">
              <Image
                src={host.logo || "/placeholder.svg"}
                alt={host.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="truncate text-sm">{host.name}</span>
              {host.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
          )}

          <div className="mb-3 flex flex-wrap gap-1">
            {opportunity.theme.slice(0, 3).map((theme) => (
              <Badge key={theme} variant="outline" className="text-xs">
                {theme}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {opportunity.minDuration}-{opportunity.maxDuration} weeks
              </span>
            </div>
            {host && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium">{host.rating}</span>
                <span className="text-muted-foreground">({host.reviewCount})</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            {opportunity.applicantTypes.map((type) => (
              <Badge key={type} variant="secondary" className="text-xs">
                <Users className="mr-1 h-3 w-3" />
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
