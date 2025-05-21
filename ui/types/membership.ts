export type MembershipStatus = "active" | "frozen" | "expired" | "cancelled"

export interface MembershipType {
  id: string
  name: string
  description: string
  price: number
  duration: number
  features: string[]
  maxAttendance?: number
  isPopular?: boolean
}

export interface FreezeRecord {
  startDate: string
  endDate?: string
  reason: string
}

export interface ProlongRecord {
  date: string
  days: number
  reason: string
}

export interface ClientMembership {
  id: string
  clientId: string
  membershipTypeId: string
  membershipName: string
  startDate: string
  endDate: string
  status: MembershipStatus
  attendanceCount: number
  maxAttendance?: number
  freezeHistory?: FreezeRecord[]
  prolongHistory?: ProlongRecord[]
}

export interface AttendanceRecord {
  id: string
  clientMembershipId: string
  date: string
  checkInTime: string
  checkOutTime?: string
  facility: string
  notes?: string
}
