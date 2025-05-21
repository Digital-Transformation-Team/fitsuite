"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, CheckCircle2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export interface MembershipType {
  id: string
  name: string
  description: string
  price: number
  duration: number // in days
  maxAttendance?: number // max number of visits
  features: string[]
  color?: string
  isPopular?: boolean
}

interface MembershipCardProps {
  membership: MembershipType
  onEdit?: (membership: MembershipType) => void
  onDelete?: (id: string) => void
  onSelect?: (membership: MembershipType) => void
  isSelectable?: boolean
}

export function MembershipCard({ membership, onEdit, onDelete, onSelect, isSelectable }: MembershipCardProps) {
  return (
    <Card className={`overflow-hidden ${membership.color ? `border-${membership.color}-200` : ""}`}>
      {membership.isPopular && (
        <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 text-center">Most Popular</div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{membership.name}</CardTitle>
            <CardDescription>{membership.description}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatCurrency(membership.price)}</div>
            <div className="text-sm text-muted-foreground">
              {membership.duration === 30
                ? "Monthly"
                : membership.duration === 90
                  ? "Quarterly"
                  : membership.duration === 365
                    ? "Annual"
                    : `${membership.duration} days`}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              Duration: <strong>{membership.duration} days</strong>
            </span>
          </div>
          {membership.maxAttendance && (
            <div className="flex items-center text-sm">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                Max visits: <strong>{membership.maxAttendance}</strong>
              </span>
            </div>
          )}
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">Features:</h4>
            <ul className="space-y-1">
              {membership.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        {isSelectable ? (
          <Button className="w-full" onClick={() => onSelect && onSelect(membership)}>
            Select Plan
          </Button>
        ) : (
          <>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(membership)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={() => onDelete(membership.id)}>
                Delete
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}
