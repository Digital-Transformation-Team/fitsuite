"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { BookingCalendar, type Booking } from "@/components/bookings/booking-calendar"
import { BookingList } from "@/components/bookings/booking-list"
import { ResourceManagement, type Court, type Masseur, type Trainer } from "@/components/bookings/resource-management"
import { FormModal } from "@/components/bookings/form-modal"
import { StatCard } from "@/components/bookings/stat-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data
const bookingsData: Booking[] = [
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

// Sample statistics data
const bookingStats = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 18 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 22 },
  { name: "Fri", value: 30 },
  { name: "Sat", value: 25 },
  { name: "Sun", value: 10 },
]

const courtUsageStats = [
  { name: "Tennis", value: 45 },
  { name: "Basketball", value: 20 },
  { name: "Squash", value: 15 },
  { name: "Massage", value: 12 },
  { name: "Yoga", value: 8 },
]

const revenueStats = [
  { name: "Jan", value: 2500 },
  { name: "Feb", value: 3200 },
  { name: "Mar", value: 3800 },
  { name: "Apr", value: 4100 },
  { name: "May", value: 4500 },
]

const clientStats = [
  { name: "Week 1", value: 25 },
  { name: "Week 2", value: 30 },
  { name: "Week 3", value: 35 },
  { name: "Week 4", value: 40 },
  { name: "Week 5", value: 45 },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(bookingsData)
  const [trainers, setTrainers] = useState<Trainer[]>(trainersData)
  const [masseurs, setMasseurs] = useState<Masseur[]>(masseursData)
  const [courts, setCourts] = useState<Court[]>(courtsData)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // Handle booking click in calendar
  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsBookingModalOpen(true)
  }

  // Handle edit booking
  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsBookingModalOpen(true)
  }

  // Handle cancel booking
  const handleCancelBooking = (bookingId: string) => {
    setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)))
  }

  // Handle update trainer
  const handleUpdateTrainer = (updatedTrainer: Trainer) => {
    setTrainers(trainers.map((trainer) => (trainer.id === updatedTrainer.id ? updatedTrainer : trainer)))
  }

  // Handle add trainer
  const handleAddTrainer = (newTrainer: Trainer) => {
    setTrainers([...trainers, newTrainer])
  }

  // Handle remove trainer
  const handleRemoveTrainer = (trainerId: string) => {
    setTrainers(trainers.filter((trainer) => trainer.id !== trainerId))
  }

  // Handle update masseur
  const handleUpdateMasseur = (updatedMasseur: Masseur) => {
    setMasseurs(masseurs.map((masseur) => (masseur.id === updatedMasseur.id ? updatedMasseur : masseur)))
  }

  // Handle add masseur
  const handleAddMasseur = (newMasseur: Masseur) => {
    setMasseurs([...masseurs, newMasseur])
  }

  // Handle remove masseur
  const handleRemoveMasseur = (masseurId: string) => {
    setMasseurs(masseurs.filter((masseur) => masseur.id !== masseurId))
  }

  // Handle update court
  const handleUpdateCourt = (updatedCourt: Court) => {
    setCourts(courts.map((court) => (court.id === updatedCourt.id ? updatedCourt : court)))
  }

  // Handle add court
  const handleAddCourt = (newCourt: Court) => {
    setCourts([...courts, newCourt])
  }

  // Handle remove court
  const handleRemoveCourt = (courtId: string) => {
    setCourts(courts.filter((court) => court.id !== courtId))
  }

  // Handle booking form submit
  const handleBookingFormSubmit = (data: Record<string, string>) => {
    if (selectedBooking) {
      // Update existing booking
      setBookings(
        bookings.map((booking) =>
          booking.id === selectedBooking.id
            ? {
                ...booking,
                title: data.title,
                client: data.client,
                trainer: data.trainer,
                court: data.court,
                start: data.start,
                end: data.end,
                status: data.status as "confirmed" | "pending" | "cancelled",
              }
            : booking,
        ),
      )
    } else {
      // Add new booking
      setBookings([
        ...bookings,
        {
          id: Math.random().toString(36).substring(7),
          title: data.title,
          client: data.client,
          trainer: data.trainer,
          court: data.court,
          start: data.start,
          end: data.end,
          status: data.status as "confirmed" | "pending" | "cancelled",
        },
      ])
    }
    setIsBookingModalOpen(false)
    setSelectedBooking(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Booking Management</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Weekly Bookings"
            value="132"
            description="7% increase from last week"
            chart="line"
            data={bookingStats}
            category="value"
            index="name"
            colors={["#2563eb"]}
          />
          <StatCard
            title="Court Usage"
            value="75%"
            description="Most popular: Tennis Courts"
            chart="bar"
            data={courtUsageStats}
            category="value"
            index="name"
            colors={["#16a34a"]}
          />
          <StatCard
            title="Monthly Revenue"
            value="$4,500"
            description="12% increase from last month"
            chart="area"
            data={revenueStats}
            category="value"
            index="name"
            colors={["#8b5cf6"]}
          />
          <StatCard
            title="New Clients"
            value="45"
            description="This month"
            chart="line"
            data={clientStats}
            category="value"
            index="name"
            colors={["#f59e0b"]}
          />
        </div>

        <Tabs defaultValue="calendar">
          <TabsList>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="management">Resource Management</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <BookingCalendar bookings={bookings} onBookingClick={handleBookingClick} />
          </TabsContent>

          <TabsContent value="list">
            <BookingList
              bookings={bookings}
              trainers={trainers.map((t) => ({ id: t.id, name: t.name }))}
              courts={courts.map((c) => ({ id: c.id, name: c.name }))}
              onEditBooking={handleEditBooking}
              onCancelBooking={handleCancelBooking}
            />
          </TabsContent>

          <TabsContent value="management">
            <ResourceManagement
              trainers={trainers}
              masseurs={masseurs}
              courts={courts}
              onUpdateTrainer={handleUpdateTrainer}
              onAddTrainer={handleAddTrainer}
              onRemoveTrainer={handleRemoveTrainer}
              onUpdateMasseur={handleUpdateMasseur}
              onAddMasseur={handleAddMasseur}
              onRemoveMasseur={handleRemoveMasseur}
              onUpdateCourt={handleUpdateCourt}
              onAddCourt={handleAddCourt}
              onRemoveCourt={handleRemoveCourt}
            />
          </TabsContent>
        </Tabs>

        {/* Booking Form Modal */}
        <FormModal
          title={selectedBooking ? "Edit Booking" : "Add Booking"}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false)
            setSelectedBooking(null)
          }}
          onSubmit={handleBookingFormSubmit}
          fields={[
            {
              name: "title",
              label: "Title",
              type: "text",
              placeholder: "Enter booking title",
              required: true,
              ...(selectedBooking && { defaultValue: selectedBooking.title }),
            },
            {
              name: "client",
              label: "Client",
              type: "text",
              placeholder: "Enter client name",
              required: true,
              ...(selectedBooking && { defaultValue: selectedBooking.client }),
            },
            {
              name: "trainer",
              label: "Trainer",
              type: "select",
              options: ["", ...trainers.filter((t) => t.status === "active").map((t) => t.name)],
              ...(selectedBooking && { defaultValue: selectedBooking.trainer }),
            },
            {
              name: "court",
              label: "Court",
              type: "select",
              options: courts.filter((c) => c.status === "available").map((c) => c.name),
              required: true,
              ...(selectedBooking && { defaultValue: selectedBooking.court }),
            },
            {
              name: "start",
              label: "Start",
              type: "date",
              required: true,
              ...(selectedBooking && { defaultValue: selectedBooking.start.split("T")[0] }),
            },
            {
              name: "end",
              label: "End",
              type: "date",
              required: true,
              ...(selectedBooking && { defaultValue: selectedBooking.end.split("T")[0] }),
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["confirmed", "pending", "cancelled"],
              required: true,
              ...(selectedBooking && { defaultValue: selectedBooking.status }),
            },
          ]}
        />
      </div>
    </AdminLayout>
  )
}
