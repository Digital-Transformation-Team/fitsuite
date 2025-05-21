import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export type SystemStatus = "online" | "offline" | "warning" | "maintenance"

export interface StatusCardProps {
  title: string
  description?: string
  status: SystemStatus
  lastChecked?: string
  uptime?: string
  details?: string
  className?: string
}

export function StatusCard({ title, description, status, lastChecked, uptime, details, className }: StatusCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {lastChecked && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              Last checked: {lastChecked}
            </div>
          )}
          {uptime && <div className="text-muted-foreground">Uptime: {uptime}</div>}
          {details && <div className="text-muted-foreground">{details}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

interface StatusBadgeProps {
  status: SystemStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant={
        status === "online"
          ? "success"
          : status === "warning"
            ? "outline"
            : status === "maintenance"
              ? "secondary"
              : "destructive"
      }
      className="flex items-center gap-1"
    >
      {status === "online" ? (
        <>
          <CheckCircle2 className="h-3 w-3" /> Online
        </>
      ) : status === "warning" ? (
        <>
          <AlertCircle className="h-3 w-3" /> Warning
        </>
      ) : status === "maintenance" ? (
        <>
          <Clock className="h-3 w-3" /> Maintenance
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" /> Offline
        </>
      )}
    </Badge>
  )
}
