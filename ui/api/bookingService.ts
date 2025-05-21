import { simulateApiDelay } from "@/lib/utils"
import type { Booking, Court, Trainer, Masseur } from "@/types/booking"

// Sample data for bookings
let bookingsData: Booking[] = [
  {
    id: "1",
    title: "Tennis Lesson",
    start: "2025-05-20T09:00:00",
    end: "2025-05-20T10:00:00",
    client: "Alex Johnson",
    trainer: "Jessica Miller",
    court: "Tennis Court 1",
    status: "confirmed",
  },
  {
    id: "2",
    title: "Basketball Practice",
    start: "2025-05-20T11:00:00",
    end: "2025-05-20T12:30:00",
    client: "Michael Brown",
    court: "Basketball Court",
    status: "confirmed",
  },
  {
    id: "3",
    title: "Massage Session",
    start: "2025-05-20T14:00:00",
    end: "2025-05-20T15:00:00",
    client: "Sarah Williams",
    court: "Massage Room 2",
    status: "pending",
  },
  {
    id: "4",
    title: "Yoga Class",
    start: "2025-05-21T10:00:00",
    end: "2025-05-21T11:00:00",
    client: "Emily Davis",
    trainer: "Robert Taylor",
    court: "Yoga Studio",
    status: "confirmed",
  },
  {
    id: "5",
    title: "Squash Game",
    start: "2025-05-21T16:00:00",
    end: "2025-05-21T17:00:00",
    client: "David Wilson",
    court: "Squash Court 1",
    status: "cancelled",
  },
  {
    id: "6",
    title: "Tennis Lesson",
    start: "2025-05-22T09:00:00",
    end: "2025-05-22T10:00:00",
    client: "Lisa Jackson",
    trainer: "Jessica Miller",
    court: "Tennis Court 2",
    status: "confirmed",
  },
]

// Sample data for trainers
const trainersData: Trainer[] = [
  {
    id: "1",
    name: "Jessica Miller",
    specialization: "Tennis Coach",
    availability: ["Monday", "Tuesday", "Wednesday", "Friday"],
    status: "active",
  },
  {
    id: "2",
    name: "Robert Taylor",
    specialization: "Yoga Instructor",
    availability: ["Monday", "Thursday", "Saturday"],
    status: "active",
  },
  {
    id: "3",
    name: "Jennifer Anderson",
    specialization: "Basketball Coach",
    availability: ["Tuesday", "Wednesday", "Friday"],
    status: "inactive",
  },
]

// Sample data for masseurs
const masseursData: Masseur[] = [
  {
    id: "1",
    name: "Thomas Moore",
    specialization: "Sports Massage",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    status: "active",
  },
  {
    id: "2",
    name: "Lisa Jackson",
    specialization: "Deep Tissue Massage",
    availability: ["Monday", "Wednesday", "Friday"],
    status: "active",
  },
]

// Sample data for courts
const courtsData: Court[] = [
  {
    id: "1",
    name: "Tennis Court 1",
    type: "Tennis",
    capacity: 4,
    status: "available",
  },
  {
    id: "2",
    name: "Tennis Court 2",
    type: "Tennis",
    capacity: 4,
    status: "available",
  },
  {
    id: "3",
    name: "Basketball Court",
    type: "Basketball",
    capacity: 10,
    status: "available",
  },
  {
    id: "4",
    name: "Squash Court 1",
    type: "Squash",
    capacity: 2,
    status: "available",
  },
  {
    id: "5",
    name: "Massage Room 1",
    type: "Massage Room",
    capacity: 1,
    status: "available",
  },
  {
    id: "6",
    name: "Massage Room 2",
    type: "Massage Room",
    capacity: 1,
    status: "blocked",
  },
  {
    id: "7",
    name: "Yoga Studio",
    type: "Yoga Studio",
    capacity: 15,
    status: "available",
  },
]

// API functions
export const fetchBookings = async (): Promise<Booking[]> => {
  await simulateApiDelay()
  return bookingsData
}

export const fetchResources = async (): Promise<{
  trainers: Trainer[]
  masseurs: Masseur[]
  courts: Court[]
}> => {
  await simulateApiDelay()
  return {
    trainers: trainersData,
    masseurs: masseursData,
    courts: courtsData,
  }
}

export const createBooking = async (bookingData: Omit<Booking, "id">): Promise<Booking> => {
  await simulateApiDelay()
  const newBooking: Booking = {
    ...bookingData,
    id: `booking-${Date.now()}`,
  }
  bookingsData = [...bookingsData, newBooking]
  return newBooking
}

export const updateBooking = async (id: string, bookingData: Partial<Booking>): Promise<Booking> => {
  await simulateApiDelay()
  const bookingIndex = bookingsData.findIndex((booking) => booking.id === id)
  if (bookingIndex === -1) {
    throw new Error(`Booking with ID ${id} not found`)
  }

  const updatedBooking = {
    ...bookingsData[bookingIndex],
    ...bookingData,
  }

  bookingsData = bookingsData.map((booking) => (booking.id === id ? updatedBooking : booking))
  return updatedBooking
}

export const cancelBooking = async (id: string): Promise<Booking> => {
  return await updateBooking(id, { status: "cancelled" })
}
