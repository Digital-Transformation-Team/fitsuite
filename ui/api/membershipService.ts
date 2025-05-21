import { simulateApiDelay } from "@/lib/utils"
import { addDays, parseISO } from "date-fns"
import type { MembershipType, ClientMembership, AttendanceRecord } from "@/types/membership"

// Sample data for membership types
const membershipTypesData: MembershipType[] = [
  {
    id: "1",
    name: "Basic Monthly",
    description: "Access to basic facilities",
    price: 49.99,
    duration: 30,
    features: ["Gym access", "Locker room", "Fitness assessment"],
  },
  {
    id: "2",
    name: "Premium Monthly",
    description: "Full access to all facilities",
    price: 79.99,
    duration: 30,
    features: ["Gym access", "Pool access", "Group classes", "Sauna", "Personal trainer (1 session)"],
    isPopular: true,
  },
  {
    id: "3",
    name: "Quarterly Premium",
    description: "Full access with discount",
    price: 199.99,
    duration: 90,
    features: ["Gym access", "Pool access", "Group classes", "Sauna", "Personal trainer (3 sessions)"],
  },
  {
    id: "4",
    name: "Annual Gold",
    description: "Best value for committed members",
    price: 599.99,
    duration: 365,
    features: [
      "Gym access",
      "Pool access",
      "Group classes",
      "Sauna",
      "Personal trainer (12 sessions)",
      "Nutrition consultation",
      "Massage (2 sessions)",
    ],
  },
  {
    id: "5",
    name: "Class Pass",
    description: "Access to group classes only",
    price: 99.99,
    duration: 30,
    maxAttendance: 10,
    features: ["Group classes only", "10 classes per month", "Online booking"],
  },
]

// Sample data for client memberships
let clientMembershipsData: ClientMembership[] = [
  {
    id: "1",
    clientId: "1",
    membershipTypeId: "2",
    membershipName: "Premium Monthly",
    startDate: "2025-04-15T00:00:00Z",
    endDate: "2025-05-15T00:00:00Z",
    status: "active",
    attendanceCount: 8,
  },
  {
    id: "2",
    clientId: "2",
    membershipTypeId: "4",
    membershipName: "Annual Gold",
    startDate: "2025-01-10T00:00:00Z",
    endDate: "2026-01-10T00:00:00Z",
    status: "active",
    attendanceCount: 45,
  },
  {
    id: "3",
    clientId: "3",
    membershipTypeId: "5",
    membershipName: "Class Pass",
    startDate: "2025-04-01T00:00:00Z",
    endDate: "2025-05-01T00:00:00Z",
    status: "active",
    attendanceCount: 7,
    maxAttendance: 10,
  },
  {
    id: "4",
    clientId: "4",
    membershipTypeId: "1",
    membershipName: "Basic Monthly",
    startDate: "2025-03-20T00:00:00Z",
    endDate: "2025-04-20T00:00:00Z",
    status: "frozen",
    attendanceCount: 3,
    freezeHistory: [
      {
        startDate: "2025-04-05T00:00:00Z",
        reason: "Medical leave",
      },
    ],
  },
  {
    id: "5",
    clientId: "5",
    membershipTypeId: "3",
    membershipName: "Quarterly Premium",
    startDate: "2025-02-15T00:00:00Z",
    endDate: "2025-05-15T00:00:00Z",
    status: "active",
    attendanceCount: 22,
  },
]

// Generate sample attendance records
const generateAttendanceRecords = (): AttendanceRecord[] => {
  const facilities = ["Gym", "Pool", "Tennis Court", "Group Class", "Yoga Studio", "Basketball Court"]
  const records: AttendanceRecord[] = []

  clientMembershipsData.forEach((membership) => {
    const count = membership.attendanceCount
    const startDate = parseISO(membership.startDate)

    for (let i = 0; i < count; i++) {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))
      const checkInHour = 7 + Math.floor(Math.random() * 12)
      const checkInMinute = Math.floor(Math.random() * 60)
      const checkInTime = `${checkInHour.toString().padStart(2, "0")}:${checkInMinute.toString().padStart(2, "0")}`

      const hasCheckOut = Math.random() > 0.3
      let checkOutTime

      if (hasCheckOut) {
        const duration = 1 + Math.floor(Math.random() * 3)
        const checkOutHour = Math.min(21, checkInHour + duration)
        const checkOutMinute = Math.floor(Math.random() * 60)
        checkOutTime = `${checkOutHour.toString().padStart(2, "0")}:${checkOutMinute.toString().padStart(2, "0")}`
      }

      const facility = facilities[Math.floor(Math.random() * facilities.length)]

      records.push({
        id: `${membership.id}-${i}`,
        clientMembershipId: membership.id,
        date: date.toISOString().split("T")[0],
        checkInTime,
        checkOutTime,
        facility,
        notes: Math.random() > 0.7 ? "Regular visit" : undefined,
      })
    }
  })

  return records
}

let attendanceRecordsData = generateAttendanceRecords()

// API functions
export const fetchMembershipTypes = async (): Promise<MembershipType[]> => {
  await simulateApiDelay()
  return membershipTypesData
}

export const fetchClientMemberships = async (): Promise<{
  memberships: ClientMembership[]
  attendanceRecords: AttendanceRecord[]
}> => {
  await simulateApiDelay()
  return {
    memberships: clientMembershipsData,
    attendanceRecords: attendanceRecordsData,
  }
}

export const assignMembership = async (data: {
  clientId: string
  membershipTypeId: string
  startDate: Date
  endDate: Date
  notes?: string
}): Promise<ClientMembership> => {
  await simulateApiDelay()

  const membershipType = membershipTypesData.find((type) => type.id === data.membershipTypeId)
  if (!membershipType) {
    throw new Error(`Membership type with ID ${data.membershipTypeId} not found`)
  }

  const newMembership: ClientMembership = {
    id: `membership-${Date.now()}`,
    clientId: data.clientId,
    membershipTypeId: data.membershipTypeId,
    membershipName: membershipType.name,
    startDate: data.startDate.toISOString(),
    endDate: data.endDate.toISOString(),
    status: "active",
    attendanceCount: 0,
    maxAttendance: membershipType.maxAttendance,
  }

  clientMembershipsData = [...clientMembershipsData, newMembership]
  return newMembership
}

export const freezeMembership = async (
  membershipId: string,
  days: number,
  reason: string,
): Promise<ClientMembership> => {
  await simulateApiDelay()

  const membershipIndex = clientMembershipsData.findIndex((m) => m.id === membershipId)
  if (membershipIndex === -1) {
    throw new Error(`Membership with ID ${membershipId} not found`)
  }

  const membership = clientMembershipsData[membershipIndex]
  const endDate = addDays(parseISO(membership.endDate), days)
  const freezeHistory = membership.freezeHistory || []

  const updatedMembership: ClientMembership = {
    ...membership,
    status: "frozen",
    endDate: endDate.toISOString(),
    freezeHistory: [
      ...freezeHistory,
      {
        startDate: new Date().toISOString(),
        reason,
      },
    ],
  }

  clientMembershipsData = clientMembershipsData.map((m) => (m.id === membershipId ? updatedMembership : m))

  return updatedMembership
}

export const unfreezeMembership = async (membershipId: string): Promise<ClientMembership> => {
  await simulateApiDelay()

  const membershipIndex = clientMembershipsData.findIndex((m) => m.id === membershipId)
  if (membershipIndex === -1) {
    throw new Error(`Membership with ID ${membershipId} not found`)
  }

  const membership = clientMembershipsData[membershipIndex]
  const freezeHistory = membership.freezeHistory || []

  let updatedMembership: ClientMembership

  if (freezeHistory.length > 0) {
    const lastFreeze = freezeHistory[freezeHistory.length - 1]

    updatedMembership = {
      ...membership,
      status: "active",
      freezeHistory: [
        ...freezeHistory.slice(0, -1),
        {
          ...lastFreeze,
          endDate: new Date().toISOString(),
        },
      ],
    }
  } else {
    updatedMembership = {
      ...membership,
      status: "active",
    }
  }

  clientMembershipsData = clientMembershipsData.map((m) => (m.id === membershipId ? updatedMembership : m))

  return updatedMembership
}

export const prolongMembership = async (
  membershipId: string,
  days: number,
  reason: string,
): Promise<ClientMembership> => {
  await simulateApiDelay()

  const membershipIndex = clientMembershipsData.findIndex((m) => m.id === membershipId)
  if (membershipIndex === -1) {
    throw new Error(`Membership with ID ${membershipId} not found`)
  }

  const membership = clientMembershipsData[membershipIndex]
  const endDate = addDays(parseISO(membership.endDate), days)
  const prolongHistory = membership.prolongHistory || []

  const updatedMembership: ClientMembership = {
    ...membership,
    endDate: endDate.toISOString(),
    prolongHistory: [
      ...prolongHistory,
      {
        date: new Date().toISOString(),
        days,
        reason,
      },
    ],
  }

  clientMembershipsData = clientMembershipsData.map((m) => (m.id === membershipId ? updatedMembership : m))

  return updatedMembership
}

export const cancelMembership = async (membershipId: string, reason: string): Promise<ClientMembership> => {
  await simulateApiDelay()

  const membershipIndex = clientMembershipsData.findIndex((m) => m.id === membershipId)
  if (membershipIndex === -1) {
    throw new Error(`Membership with ID ${membershipId} not found`)
  }

  const membership = clientMembershipsData[membershipIndex]

  const updatedMembership: ClientMembership = {
    ...membership,
    status: "cancelled",
  }

  clientMembershipsData = clientMembershipsData.map((m) => (m.id === membershipId ? updatedMembership : m))

  return updatedMembership
}

export const addAttendance = async (
  record: Omit<AttendanceRecord, "id">,
): Promise<{
  record: AttendanceRecord
  updatedMembership: ClientMembership
}> => {
  await simulateApiDelay()

  const membershipIndex = clientMembershipsData.findIndex((m) => m.id === record.clientMembershipId)
  if (membershipIndex === -1) {
    throw new Error(`Membership with ID ${record.clientMembershipId} not found`)
  }

  const membership = clientMembershipsData[membershipIndex]

  const newRecord: AttendanceRecord = {
    ...record,
    id: `attendance-${Date.now()}`,
  }

  attendanceRecordsData = [...attendanceRecordsData, newRecord]

  const updatedMembership: ClientMembership = {
    ...membership,
    attendanceCount: membership.attendanceCount + 1,
  }

  clientMembershipsData = clientMembershipsData.map((m) => (m.id === record.clientMembershipId ? updatedMembership : m))

  return {
    record: newRecord,
    updatedMembership,
  }
}
