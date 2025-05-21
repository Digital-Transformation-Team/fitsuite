"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { format, addDays, parseISO, subDays } from "date-fns"

import { MembershipCard, type MembershipType } from "@/components/memberships/membership-card"
import { ClientMembershipTable } from "@/components/memberships/client-membership-table"
import type { ClientMembership } from "@/components/memberships/action-buttons"
import { ChartCard } from "@/components/memberships/chart-card"
import { AttendanceTracker, type AttendanceRecord } from "@/components/memberships/attendance-tracker"
import { AssignMembershipForm } from "@/components/memberships/assign-membership-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Sample data
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

const clientsData = [
  { id: "1", name: "Alex Johnson", email: "alex@example.com" },
  { id: "2", name: "Sarah Williams", email: "sarah@example.com" },
  { id: "3", name: "Michael Brown", email: "michael@example.com" },
  { id: "4", name: "Emily Davis", email: "emily@example.com" },
  { id: "5", name: "David Wilson", email: "david@example.com" },
]

const clientMembershipsData: ClientMembership[] = [
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
      const date = format(subDays(new Date(), Math.floor(Math.random() * 30)), "yyyy-MM-dd")
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
        date,
        checkInTime,
        checkOutTime,
        facility,
        notes: Math.random() > 0.7 ? "Regular visit" : undefined,
      })
    }
  })

  return records
}

const attendanceRecordsData = generateAttendanceRecords()

// Sample statistics data
const membershipsByTypeData = [
  { name: "Basic Monthly", value: 45 },
  { name: "Premium Monthly", value: 78 },
  { name: "Quarterly Premium", value: 32 },
  { name: "Annual Gold", value: 24 },
  { name: "Class Pass", value: 56 },
]

const attendanceByDayData = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 145 },
  { name: "Wed", value: 135 },
  { name: "Thu", value: 160 },
  { name: "Fri", value: 180 },
  { name: "Sat", value: 210 },
  { name: "Sun", value: 130 },
]

const membershipGrowthData = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 145 },
  { name: "Mar", value: 165 },
  { name: "Apr", value: 190 },
  { name: "May", value: 220 },
]

const facilityUsageData = [
  { name: "Gym", value: 450 },
  { name: "Pool", value: 280 },
  { name: "Tennis", value: 150 },
  { name: "Classes", value: 320 },
  { name: "Yoga", value: 180 },
]

export default function MembershipsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [membershipTypes, setMembershipTypes] = useState<MembershipType[]>(membershipTypesData)
  const [clientMemberships, setClientMemberships] = useState<ClientMembership[]>(clientMembershipsData)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(attendanceRecordsData)
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState<ClientMembership | null>(null)
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false)

  // Membership type handlers
  const handleEditMembershipType = (membership: MembershipType) => {
    // In a real app, you would open a form to edit the membership type
    console.log("Edit membership type:", membership)
  }

  const handleDeleteMembershipType = (id: string) => {
    setMembershipTypes(membershipTypes.filter((type) => type.id !== id))
  }

  // Client membership handlers
  const handleAssignMembership = (data: {
    clientId: string
    membershipTypeId: string
    startDate: Date
    endDate: Date
    notes?: string
  }) => {
    const membershipType = membershipTypes.find((type) => type.id === data.membershipTypeId)
    const client = clientsData.find((client) => client.id === data.clientId)

    if (membershipType && client) {
      const newMembership: ClientMembership = {
        id: Math.random().toString(36).substring(7),
        clientId: data.clientId,
        membershipTypeId: data.membershipTypeId,
        membershipName: membershipType.name,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        status: "active",
        attendanceCount: 0,
        maxAttendance: membershipType.maxAttendance,
      }

      setClientMemberships([...clientMemberships, newMembership])
      setShowAssignForm(false)
    }
  }

  const handleFreezeMembership = (membershipId: string, days: number, reason: string) => {
    setClientMemberships(
      clientMemberships.map((membership) => {
        if (membership.id === membershipId) {
          const endDate = addDays(parseISO(membership.endDate), days)
          const freezeHistory = membership.freezeHistory || []

          return {
            ...membership,
            status: "frozen" as const,
            endDate: endDate.toISOString(),
            freezeHistory: [
              ...freezeHistory,
              {
                startDate: new Date().toISOString(),
                reason,
              },
            ],
          }
        }
        return membership
      }),
    )
  }

  const handleUnfreezeMembership = (membershipId: string) => {
    setClientMemberships(
      clientMemberships.map((membership) => {
        if (membership.id === membershipId) {
          const freezeHistory = membership.freezeHistory || []

          if (freezeHistory.length > 0) {
            const lastFreeze = freezeHistory[freezeHistory.length - 1]

            return {
              ...membership,
              status: "active" as const,
              freezeHistory: [
                ...freezeHistory.slice(0, -1),
                {
                  ...lastFreeze,
                  endDate: new Date().toISOString(),
                },
              ],
            }
          }

          return {
            ...membership,
            status: "active" as const,
          }
        }
        return membership
      }),
    )
  }

  const handleProlongMembership = (membershipId: string, days: number, reason: string) => {
    setClientMemberships(
      clientMemberships.map((membership) => {
        if (membership.id === membershipId) {
          const endDate = addDays(parseISO(membership.endDate), days)
          const prolongHistory = membership.prolongHistory || []

          return {
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
        }
        return membership
      }),
    )
  }

  const handleCancelMembership = (membershipId: string, reason: string) => {
    setClientMemberships(
      clientMemberships.map((membership) => {
        if (membership.id === membershipId) {
          return {
            ...membership,
            status: "cancelled" as const,
          }
        }
        return membership
      }),
    )
  }

  const handleViewMembershipDetails = (membership: ClientMembership) => {
    // In a real app, you would open a dialog with membership details
    console.log("View membership details:", membership)
  }

  const handleViewAttendance = (membership: ClientMembership) => {
    setSelectedMembership(membership)
    setShowAttendanceDialog(true)
  }

  // Attendance handlers
  const handleAddAttendance = (record: Omit<AttendanceRecord, "id">) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: Math.random().toString(36).substring(7),
    }

    setAttendanceRecords([...attendanceRecords, newRecord])

    // Update attendance count
    setClientMemberships(
      clientMemberships.map((membership) => {
        if (membership.id === record.clientMembershipId) {
          return {
            ...membership,
            attendanceCount: membership.attendanceCount + 1,
          }
        }
        return membership
      }),
    )
  }

  // Filter attendance records for selected membership
  const filteredAttendanceRecords = selectedMembership
    ? attendanceRecords.filter((record) => record.clientMembershipId === selectedMembership.id)
    : []

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Membership Management</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowAssignForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Assign Membership
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="membership-types">Membership Types</TabsTrigger>
            <TabsTrigger value="client-memberships">Client Memberships</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Active Memberships</CardTitle>
                  <div className="text-2xl font-bold">
                    {clientMemberships.filter((m) => m.status === "active").length}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {clientMemberships.filter((m) => m.status === "frozen").length} frozen,{" "}
                    {clientMemberships.filter((m) => m.status === "expired" || m.status === "cancelled").length} expired
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
                  <div className="text-2xl font-bold">24</div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 12%</span> from yesterday
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">New Memberships (This Month)</CardTitle>
                  <div className="text-2xl font-bold">18</div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 8%</span> from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Expiring Soon (7 Days)</CardTitle>
                  <div className="text-2xl font-bold">5</div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    <Button variant="link" className="h-auto p-0 text-xs">
                      View expiring memberships
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChartCard
                title="Memberships by Type"
                chart="bar"
                data={membershipsByTypeData}
                index="name"
                categories={["value"]}
                colors={["#2563eb"]}
              />
              <ChartCard
                title="Attendance by Day"
                chart="line"
                data={attendanceByDayData}
                index="name"
                categories={["value"]}
                colors={["#16a34a"]}
              />
              <ChartCard
                title="Membership Growth"
                chart="area"
                data={membershipGrowthData}
                index="name"
                categories={["value"]}
                colors={["#8b5cf6"]}
              />
              <ChartCard
                title="Facility Usage"
                chart="bar"
                data={facilityUsageData}
                index="name"
                categories={["value"]}
                colors={["#f59e0b"]}
              />
            </div>
          </TabsContent>

          {/* Membership Types Tab */}
          <TabsContent value="membership-types" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Membership Types</CardTitle>
                <CardDescription>Manage your membership plans and offerings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {membershipTypes.map((membership) => (
                    <MembershipCard
                      key={membership.id}
                      membership={membership}
                      onEdit={handleEditMembershipType}
                      onDelete={handleDeleteMembershipType}
                    />
                  ))}
                  <Card className="flex flex-col items-center justify-center p-6 border-dashed h-full">
                    <Button variant="outline" className="w-full" onClick={() => console.log("Add new membership type")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Membership Type
                    </Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Memberships Tab */}
          <TabsContent value="client-memberships" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Memberships</CardTitle>
                <CardDescription>Manage memberships assigned to clients</CardDescription>
              </CardHeader>
              <CardContent>
                <ClientMembershipTable
                  memberships={clientMemberships}
                  onFreeze={handleFreezeMembership}
                  onUnfreeze={handleUnfreezeMembership}
                  onProlong={handleProlongMembership}
                  onCancel={handleCancelMembership}
                  onViewDetails={handleViewMembershipDetails}
                  onViewAttendance={handleViewAttendance}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Assign Membership Dialog */}
        {showAssignForm && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full">
              <AssignMembershipForm
                clients={clientsData}
                membershipTypes={membershipTypes}
                onAssign={handleAssignMembership}
                onCancel={() => setShowAssignForm(false)}
              />
            </div>
          </div>
        )}

        {/* Attendance Dialog */}
        <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Attendance Records</DialogTitle>
              <DialogDescription>
                {selectedMembership?.membershipName} -{" "}
                {clientsData.find((c) => c.id === selectedMembership?.clientId)?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedMembership && (
              <AttendanceTracker
                membership={selectedMembership}
                attendanceRecords={filteredAttendanceRecords}
                onAddAttendance={handleAddAttendance}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
