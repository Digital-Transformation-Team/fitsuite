"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { UserTable, type User } from "@/components/users/user-table"
import { UserCard } from "@/components/users/user-card"
import { FilterPanel } from "@/components/users/filter-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"

// Sample data
const clientsData: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Client",
    status: "active",
    lastActive: "Today",
    subscription: "Premium",
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "Client",
    status: "active",
    lastActive: "Yesterday",
    subscription: "Standard",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Client",
    status: "inactive",
    lastActive: "2 weeks ago",
    subscription: "Basic",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "Client",
    status: "blocked",
    lastActive: "1 month ago",
    subscription: "Premium",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@example.com",
    role: "Client",
    status: "active",
    lastActive: "Today",
    subscription: "Trial",
  },
]

const trainersData: User[] = [
  {
    id: "6",
    name: "Jessica Miller",
    email: "jessica@example.com",
    role: "Trainer",
    status: "active",
    lastActive: "Today",
  },
  {
    id: "7",
    name: "Robert Taylor",
    email: "robert@example.com",
    role: "Trainer",
    status: "active",
    lastActive: "Yesterday",
  },
  {
    id: "8",
    name: "Jennifer Anderson",
    email: "jennifer@example.com",
    role: "Trainer",
    status: "inactive",
    lastActive: "3 days ago",
  },
]

const masseursData: User[] = [
  {
    id: "9",
    name: "Thomas Moore",
    email: "thomas@example.com",
    role: "Masseur",
    status: "active",
    lastActive: "Today",
  },
  {
    id: "10",
    name: "Lisa Jackson",
    email: "lisa@example.com",
    role: "Masseur",
    status: "active",
    lastActive: "Yesterday",
  },
]

const managersData: User[] = [
  {
    id: "11",
    name: "Daniel White",
    email: "daniel@example.com",
    role: "Manager",
    status: "active",
    lastActive: "Today",
  },
  {
    id: "12",
    name: "Olivia Martin",
    email: "olivia@example.com",
    role: "Manager",
    status: "active",
    lastActive: "Yesterday",
  },
]

export default function UsersPage() {
  const [mainTab, setMainTab] = useState("clients")
  const [staffTab, setStaffTab] = useState("trainers")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  // State for user data
  const [clients, setClients] = useState<User[]>(clientsData)
  const [trainers, setTrainers] = useState<User[]>(trainersData)
  const [masseurs, setMasseurs] = useState<User[]>(masseursData)
  const [managers, setManagers] = useState<User[]>(managersData)

  // Handle block/unblock user
  const handleBlockUser = (userId: string) => {
    const updateStatus = (users: User[]) =>
      users.map((user) => (user.id === userId ? { ...user, status: "blocked" as const } : user))

    if (mainTab === "clients") {
      setClients(updateStatus(clients))
    } else if (staffTab === "trainers") {
      setTrainers(updateStatus(trainers))
    } else if (staffTab === "masseurs") {
      setMasseurs(updateStatus(masseurs))
    } else if (staffTab === "managers") {
      setManagers(updateStatus(managers))
    }
  }

  const handleUnblockUser = (userId: string) => {
    const updateStatus = (users: User[]) =>
      users.map((user) => (user.id === userId ? { ...user, status: "active" as const } : user))

    if (mainTab === "clients") {
      setClients(updateStatus(clients))
    } else if (staffTab === "trainers") {
      setTrainers(updateStatus(trainers))
    } else if (staffTab === "masseurs") {
      setMasseurs(updateStatus(masseurs))
    } else if (staffTab === "managers") {
      setManagers(updateStatus(managers))
    }
  }

  // Handle filter change
  const handleFilterChange = (filters: any) => {
    console.log("Filters applied:", filters)
    // In a real app, you would filter the data based on the filters
  }

  // Get current data based on selected tabs
  const getCurrentData = () => {
    if (mainTab === "clients") {
      return clients
    } else {
      if (staffTab === "trainers") return trainers
      if (staffTab === "masseurs") return masseurs
      if (staffTab === "managers") return managers
      return []
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Table view</span>
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8"
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="clients" value={mainTab} onValueChange={setMainTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filter Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <FilterPanel onFilterChange={handleFilterChange} userType={mainTab as "clients" | "staff"} />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <TabsContent value="clients" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Client Management</h2>

                  {viewMode === "table" ? (
                    <UserTable users={clients} onBlockUser={handleBlockUser} onUnblockUser={handleUnblockUser} />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {clients.map((client) => (
                        <UserCard
                          key={client.id}
                          user={client}
                          onBlockUser={handleBlockUser}
                          onUnblockUser={handleUnblockUser}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="staff" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Staff Management</h2>

                  <Tabs defaultValue="trainers" value={staffTab} onValueChange={setStaffTab}>
                    <TabsList>
                      <TabsTrigger value="trainers">Trainers</TabsTrigger>
                      <TabsTrigger value="masseurs">Masseurs</TabsTrigger>
                      <TabsTrigger value="managers">Managers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="trainers" className="mt-4">
                      {viewMode === "table" ? (
                        <UserTable users={trainers} onBlockUser={handleBlockUser} onUnblockUser={handleUnblockUser} />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {trainers.map((trainer) => (
                            <UserCard
                              key={trainer.id}
                              user={trainer}
                              onBlockUser={handleBlockUser}
                              onUnblockUser={handleUnblockUser}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="masseurs" className="mt-4">
                      {viewMode === "table" ? (
                        <UserTable users={masseurs} onBlockUser={handleBlockUser} onUnblockUser={handleUnblockUser} />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {masseurs.map((masseur) => (
                            <UserCard
                              key={masseur.id}
                              user={masseur}
                              onBlockUser={handleBlockUser}
                              onUnblockUser={handleUnblockUser}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="managers" className="mt-4">
                      {viewMode === "table" ? (
                        <UserTable users={managers} onBlockUser={handleBlockUser} onUnblockUser={handleUnblockUser} />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {managers.map((manager) => (
                            <UserCard
                              key={manager.id}
                              user={manager}
                              onBlockUser={handleBlockUser}
                              onUnblockUser={handleUnblockUser}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
