import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle, XCircle, Clock, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export type ComplianceStatus = "compliant" | "partial" | "non-compliant" | "pending"

export interface DataProtectionItem {
  id: string
  name: string
  description: string
  status: ComplianceStatus
  lastAudit?: string
  dueDate?: string
}

interface DataProtectionStatusProps {
  items: DataProtectionItem[]
  overallScore: number
  lastAudit?: string
  nextAudit?: string
  className?: string
}

export function DataProtectionStatus({
  items,
  overallScore,
  lastAudit,
  nextAudit,
  className,
}: DataProtectionStatusProps) {
  // Calculate compliance statistics
  const compliantCount = items.filter((item) => item.status === "compliant").length
  const partialCount = items.filter((item) => item.status === "partial").length
  const nonCompliantCount = items.filter((item) => item.status === "non-compliant").length
  const pendingCount = items.filter((item) => item.status === "pending").length

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Data Protection Status
          </CardTitle>
          <CardDescription>Overall compliance with data protection requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between text-sm">
                <span>Overall Compliance Score</span>
                <span className="font-medium">{overallScore}%</span>
              </div>
              <Progress value={overallScore} className="h-2" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <ComplianceStatCard
                title="Compliant"
                count={compliantCount}
                total={items.length}
                icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
              />
              <ComplianceStatCard
                title="Partial"
                count={partialCount}
                total={items.length}
                icon={<AlertCircle className="h-4 w-4 text-amber-500" />}
              />
              <ComplianceStatCard
                title="Non-Compliant"
                count={nonCompliantCount}
                total={items.length}
                icon={<XCircle className="h-4 w-4 text-red-500" />}
              />
              <ComplianceStatCard
                title="Pending"
                count={pendingCount}
                total={items.length}
                icon={<Clock className="h-4 w-4 text-blue-500" />}
              />
            </div>

            {(lastAudit || nextAudit) && (
              <div className="flex flex-col sm:flex-row justify-between text-sm text-muted-foreground pt-2">
                {lastAudit && <div>Last audit: {lastAudit}</div>}
                {nextAudit && <div>Next scheduled audit: {nextAudit}</div>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {items.map((item) => (
          <ComplianceItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

interface ComplianceStatCardProps {
  title: string
  count: number
  total: number
  icon: React.ReactNode
}

function ComplianceStatCard({ title, count, total, icon }: ComplianceStatCardProps) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div className="flex flex-col p-3 border rounded-md">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-xs text-muted-foreground">{percentage}% of requirements</div>
    </div>
  )
}

interface ComplianceItemCardProps {
  item: DataProtectionItem
}

function ComplianceItemCard({ item }: ComplianceItemCardProps) {
  return (
    <div
      className={cn(
        "p-4 border rounded-md",
        item.status === "compliant" && "border-l-4 border-l-green-500",
        item.status === "partial" && "border-l-4 border-l-amber-500",
        item.status === "non-compliant" && "border-l-4 border-l-red-500",
        item.status === "pending" && "border-l-4 border-l-blue-500",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          {item.lastAudit && <p className="text-xs text-muted-foreground mt-1">Last checked: {item.lastAudit}</p>}
        </div>
        <StatusIcon status={item.status} />
      </div>
      {item.dueDate && item.status !== "compliant" && (
        <div className="mt-2 text-xs flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">Due by: {item.dueDate}</span>
        </div>
      )}
    </div>
  )
}

interface StatusIconProps {
  status: ComplianceStatus
}

function StatusIcon({ status }: StatusIconProps) {
  switch (status) {
    case "compliant":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case "partial":
      return <AlertCircle className="h-5 w-5 text-amber-500" />
    case "non-compliant":
      return <XCircle className="h-5 w-5 text-red-500" />
    case "pending":
      return <Clock className="h-5 w-5 text-blue-500" />
  }
}
