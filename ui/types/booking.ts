export type BookingStatus = "confirmed" | "pending" | "cancelled"
export type ResourceStatus = "available" | "blocked" | "maintenance"

export interface Booking {
  id: string
  title: string
  start: string
  end: string
  client: string
  trainer?: string
  court: string
  status: BookingStatus
}

export interface Trainer {
  id: string
  name: string
  specialization: string
  availability: string[]
  status: "active" | "inactive"
}

export interface Masseur {
  id: string
  name: string
  specialization: string
  availability: string[]
  status: "active" | "inactive"
}

export interface Court {
  id: string
  name: string
  type: string
  capacity: number
  status: ResourceStatus
}
