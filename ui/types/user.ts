export type UserStatus = "active" | "inactive" | "blocked"

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: UserStatus
  lastActive?: string
  subscription?: string
}
