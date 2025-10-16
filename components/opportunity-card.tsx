import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Clock, Users } from "lucide-react"

interface Opportunity {
  id: string
  title: string
  description: string
  theme: string[]
  location: string
  country: string
  applicantTypes: string[]
  minDuration: number
  maxDuration: number
  images: string[]
  featured: boolean
  host: {
    id: string
    name: string
    logo: string | null
    verified: boolean
    rating: number
    reviewCount: number
  }
}

interface OpportunityCardProps {
  opportunity: Opportunity
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={opportunity.images[0] || "/placeholder.svg?height=400&width=600&query=volunteer opportunity"}
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

          <div className="mb-3 flex items-center gap-2">
            {opportunity.host.logo ? (
              <Image
                src={opportunity.host.logo || "/placeholder.svg"}
                alt={opportunity.host.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-muted" />
            )}
            <span className="truncate text-sm">{opportunity.host.name}</span>
            {opportunity.host.verified && (
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            )}
          </div>

          <div className="mb-3 flex flex-wrap gap-1">
            {opportunity.theme.slice(0, 3).map((theme) => (
              <Badge key={theme} variant="outline" className="text-xs capitalize">
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
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium">{(Number(opportunity.host.rating) || 0).toFixed(1)}</span>
              <span className="text-muted-foreground">({opportunity.host.reviewCount})</span>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            {opportunity.applicantTypes.map((type) => (
              <Badge key={type} variant="secondary" className="text-xs capitalize">
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
