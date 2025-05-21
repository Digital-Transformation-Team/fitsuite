import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StatItem {
  label: string
  value: string | number
  change?: number
  trend?: "up" | "down" | "neutral"
  changeLabel?: string
}

interface StatSummaryProps {
  stats: StatItem[]
  className?: string
}

export function StatSummary({ stats, className }: StatSummaryProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">{stat.value}</h2>
                {stat.trend && (
                  <div
                    className={cn(
                      "flex items-center text-xs font-medium",
                      stat.trend === "up" && "text-green-500",
                      stat.trend === "down" && "text-red-500",
                      stat.trend === "neutral" && "text-muted-foreground",
                    )}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUp className="mr-1 h-4 w-4" />
                    ) : stat.trend === "down" ? (
                      <ArrowDown className="mr-1 h-4 w-4" />
                    ) : (
                      <Minus className="mr-1 h-4 w-4" />
                    )}
                    {stat.change !== undefined && `${Math.abs(stat.change)}%`}
                    {stat.changeLabel && <span className="ml-1">{stat.changeLabel}</span>}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
