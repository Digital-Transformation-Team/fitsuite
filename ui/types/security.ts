export type SystemStatus = "online" | "offline" | "warning" | "maintenance"
export type ActionStatus = "success" | "warning" | "error" | "info"
export type ComplianceStatus = "compliant" | "partial" | "non-compliant" | "pending"

export interface SystemStatusItem {
  title: string
  description: string
  status: SystemStatus
  lastChecked: string
  uptime: string
  details?: string
}

export interface ActionLogEntry {
  id: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  action: string
  timestamp: string
  ipAddress: string
  status: ActionStatus
  details?: string
}

export interface Permission {
  id: string
  name: string
  description: string
  module: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  usersCount: number
}

export interface DataProtectionItem {
  id: string
  name: string
  description: string
  status: ComplianceStatus
  lastAudit?: string
  dueDate?: string
}
