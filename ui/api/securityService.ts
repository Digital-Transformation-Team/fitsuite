import { simulateApiDelay } from "@/lib/utils"
import type { ActionLogEntry, SystemStatusItem, Role, Permission, DataProtectionItem } from "@/types/security"

// Sample data for action logs
const generateActionLogs = (): ActionLogEntry[] => {
  const users = [
    { id: "1", name: "Admin User", email: "admin@example.com", role: "Administrator" },
    { id: "2", name: "John Manager", email: "john@example.com", role: "Manager" },
    { id: "3", name: "Sarah Staff", email: "sarah@example.com", role: "Staff" },
    { id: "4", name: "Mike Trainer", email: "mike@example.com", role: "Trainer" },
  ]

  const actions = [
    "User login",
    "User logout",
    "Password change",
    "User profile update",
    "Created new membership",
    "Updated client record",
    "Deleted booking",
    "Exported client data",
    "Changed system settings",
    "Added new role",
    "Modified permissions",
    "Reset user password",
  ]

  const statuses = ["success", "warning", "error", "info"] as const
  const ipAddresses = ["192.168.1.1", "10.0.0.5", "172.16.254.1", "192.168.0.100", "10.10.10.10"]

  const logs: ActionLogEntry[] = []

  for (let i = 0; i < 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const ipAddress = ipAddresses[Math.floor(Math.random() * ipAddresses.length)]

    // Generate a random date within the last 30 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60))

    logs.push({
      id: `log-${i}`,
      user,
      action,
      timestamp: date.toISOString(),
      ipAddress,
      status,
      details:
        status === "error" || status === "warning"
          ? `Details about the ${action.toLowerCase()} action that resulted in ${status} status.`
          : undefined,
    })
  }

  // Sort logs by timestamp (newest first)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// Sample data for system status
const systemStatusData: SystemStatusItem[] = [
  {
    title: "Authentication Service",
    description: "User authentication and authorization",
    status: "online",
    lastChecked: "Today, 10:45 AM",
    uptime: "99.99% (30 days)",
  },
  {
    title: "Database Server",
    description: "Primary database instance",
    status: "online",
    lastChecked: "Today, 10:45 AM",
    uptime: "99.95% (30 days)",
  },
  {
    title: "API Gateway",
    description: "API request handling and routing",
    status: "warning",
    lastChecked: "Today, 10:45 AM",
    uptime: "99.87% (30 days)",
    details: "High latency detected in US-WEST region",
  },
  {
    title: "File Storage",
    description: "Document and media storage",
    status: "online",
    lastChecked: "Today, 10:45 AM",
    uptime: "100% (30 days)",
  },
  {
    title: "Email Service",
    description: "Transactional email delivery",
    status: "online",
    lastChecked: "Today, 10:45 AM",
    uptime: "99.92% (30 days)",
  },
  {
    title: "Backup System",
    description: "Automated data backup service",
    status: "maintenance",
    lastChecked: "Today, 10:45 AM",
    uptime: "N/A",
    details: "Scheduled maintenance until 2:00 PM",
  },
]

// Sample data for permissions
const permissionsData: Permission[] = [
  { id: "p1", name: "View Users", description: "Can view user list", module: "Users" },
  { id: "p2", name: "Create Users", description: "Can create new users", module: "Users" },
  { id: "p3", name: "Edit Users", description: "Can edit user details", module: "Users" },
  { id: "p4", name: "Delete Users", description: "Can delete users", module: "Users" },
  { id: "p5", name: "View Memberships", description: "Can view memberships", module: "Memberships" },
  { id: "p6", name: "Create Memberships", description: "Can create memberships", module: "Memberships" },
  { id: "p7", name: "Edit Memberships", description: "Can edit memberships", module: "Memberships" },
  { id: "p8", name: "Delete Memberships", description: "Can delete memberships", module: "Memberships" },
  { id: "p9", name: "View Bookings", description: "Can view bookings", module: "Bookings" },
  { id: "p10", name: "Create Bookings", description: "Can create bookings", module: "Bookings" },
  { id: "p11", name: "Edit Bookings", description: "Can edit bookings", module: "Bookings" },
  { id: "p12", name: "Delete Bookings", description: "Can delete bookings", module: "Bookings" },
  { id: "p13", name: "View Reports", description: "Can view reports", module: "Reports" },
  { id: "p14", name: "Export Reports", description: "Can export reports", module: "Reports" },
  { id: "p15", name: "View System Logs", description: "Can view system logs", module: "System" },
  { id: "p16", name: "Manage System Settings", description: "Can manage system settings", module: "System" },
  { id: "p17", name: "Manage Roles", description: "Can manage roles and permissions", module: "System" },
]

// Sample data for roles
let rolesData: Role[] = [
  {
    id: "r1",
    name: "Administrator",
    description: "Full system access",
    permissions: permissionsData.map((p) => p.id),
    usersCount: 2,
  },
  {
    id: "r2",
    name: "Manager",
    description: "Can manage most aspects of the system",
    permissions: ["p1", "p2", "p3", "p5", "p6", "p7", "p8", "p9", "p10", "p11", "p12", "p13", "p14"],
    usersCount: 5,
  },
  {
    id: "r3",
    name: "Staff",
    description: "Front desk and general staff",
    permissions: ["p1", "p5", "p6", "p9", "p10", "p11"],
    usersCount: 12,
  },
  {
    id: "r4",
    name: "Trainer",
    description: "Fitness trainers and instructors",
    permissions: ["p1", "p5", "p9", "p10", "p11"],
    usersCount: 8,
  },
  {
    id: "r5",
    name: "Read Only",
    description: "View-only access to the system",
    permissions: ["p1", "p5", "p9", "p13"],
    usersCount: 3,
  },
]

// Sample data for data protection
let dataProtectionItemsData: DataProtectionItem[] = [
  {
    id: "dp1",
    name: "User Data Encryption",
    description: "All user personal data must be encrypted at rest and in transit",
    status: "compliant",
    lastAudit: "May 10, 2025",
  },
  {
    id: "dp2",
    name: "Data Retention Policy",
    description: "User data must be retained according to the data retention policy",
    status: "compliant",
    lastAudit: "May 10, 2025",
  },
  {
    id: "dp3",
    name: "Access Controls",
    description: "Access to personal data must be restricted to authorized personnel only",
    status: "compliant",
    lastAudit: "May 10, 2025",
  },
  {
    id: "dp4",
    name: "Data Processing Agreements",
    description: "Agreements must be in place with all third-party data processors",
    status: "partial",
    lastAudit: "May 10, 2025",
    dueDate: "June 15, 2025",
  },
  {
    id: "dp5",
    name: "Privacy Policy",
    description: "Privacy policy must be up-to-date and compliant with regulations",
    status: "compliant",
    lastAudit: "May 10, 2025",
  },
  {
    id: "dp6",
    name: "Data Subject Rights",
    description: "Processes must be in place to handle data subject rights requests",
    status: "partial",
    lastAudit: "May 10, 2025",
    dueDate: "June 30, 2025",
  },
  {
    id: "dp7",
    name: "Data Breach Response",
    description: "Data breach response plan must be documented and tested",
    status: "non-compliant",
    lastAudit: "May 10, 2025",
    dueDate: "June 1, 2025",
  },
  {
    id: "dp8",
    name: "Staff Training",
    description: "All staff must receive regular data protection training",
    status: "pending",
    dueDate: "July 15, 2025",
  },
]

// API functions
export const fetchActionLogs = async (): Promise<ActionLogEntry[]> => {
  await simulateApiDelay()
  return generateActionLogs()
}

export const fetchSystemStatus = async (): Promise<SystemStatusItem[]> => {
  await simulateApiDelay()
  return systemStatusData
}

export const fetchRolesAndPermissions = async (): Promise<{ roles: Role[]; permissions: Permission[] }> => {
  await simulateApiDelay()
  return {
    roles: rolesData,
    permissions: permissionsData,
  }
}

export const fetchDataProtectionItems = async (): Promise<{
  items: DataProtectionItem[]
  lastAudit: string
  nextAudit: string
}> => {
  await simulateApiDelay()
  return {
    items: dataProtectionItemsData,
    lastAudit: "May 10, 2025",
    nextAudit: "August 10, 2025",
  }
}

export const createRole = async (role: Omit<Role, "id" | "usersCount">): Promise<Role> => {
  await simulateApiDelay()
  const newRole: Role = {
    ...role,
    id: `r${rolesData.length + 1}`,
    usersCount: 0,
  }
  rolesData = [...rolesData, newRole]
  return newRole
}

export const updateRole = async (id: string, roleData: Omit<Role, "id" | "usersCount">): Promise<Role> => {
  await simulateApiDelay()
  const roleIndex = rolesData.findIndex((role) => role.id === id)
  if (roleIndex === -1) {
    throw new Error(`Role with ID ${id} not found`)
  }

  const updatedRole = {
    ...rolesData[roleIndex],
    ...roleData,
    id,
    usersCount: rolesData[roleIndex].usersCount,
  }

  rolesData = rolesData.map((role) => (role.id === id ? updatedRole : role))
  return updatedRole
}

export const deleteRole = async (id: string): Promise<void> => {
  await simulateApiDelay()
  const roleIndex = rolesData.findIndex((role) => role.id === id)
  if (roleIndex === -1) {
    throw new Error(`Role with ID ${id} not found`)
  }

  rolesData = rolesData.filter((role) => role.id !== id)
}

export const updateDataProtectionItem = async (
  id: string,
  data: Partial<DataProtectionItem>,
): Promise<DataProtectionItem> => {
  await simulateApiDelay()
  const itemIndex = dataProtectionItemsData.findIndex((item) => item.id === id)
  if (itemIndex === -1) {
    throw new Error(`Data protection item with ID ${id} not found`)
  }

  const updatedItem = {
    ...dataProtectionItemsData[itemIndex],
    ...data,
  }

  dataProtectionItemsData = dataProtectionItemsData.map((item) => (item.id === id ? updatedItem : item))
  return updatedItem
}
