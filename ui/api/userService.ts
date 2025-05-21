import { simulateApiDelay } from "@/lib/utils"
import type { User } from "@/types/user"

// Sample data for users
let clientsData: User[] = [
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

let trainersData: User[] = [
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

let masseursData: User[] = [
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

let managersData: User[] = [
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

// API functions
export const fetchUsers = async (): Promise<{
  clients: User[]
  trainers: User[]
  masseurs: User[]
  managers: User[]
}> => {
  await simulateApiDelay()
  return {
    clients: clientsData,
    trainers: trainersData,
    masseurs: masseursData,
    managers: managersData,
  }
}

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  await simulateApiDelay()

  // Find which category the user belongs to
  let userCategory: "clients" | "trainers" | "masseurs" | "managers" | null = null
  let userIndex = -1

  if ((userIndex = clientsData.findIndex((user) => user.id === id)) !== -1) {
    userCategory = "clients"
  } else if ((userIndex = trainersData.findIndex((user) => user.id === id)) !== -1) {
    userCategory = "trainers"
  } else if ((userIndex = masseursData.findIndex((user) => user.id === id)) !== -1) {
    userCategory = "masseurs"
  } else if ((userIndex = managersData.findIndex((user) => user.id === id)) !== -1) {
    userCategory = "managers"
  }

  if (!userCategory || userIndex === -1) {
    throw new Error(`User with ID ${id} not found`)
  }

  // Update the user
  const dataMap = {
    clients: clientsData,
    trainers: trainersData,
    masseurs: masseursData,
    managers: managersData,
  }

  const updatedUser = {
    ...dataMap[userCategory][userIndex],
    ...userData,
  }

  // Update the appropriate data array
  if (userCategory === "clients") {
    clientsData = clientsData.map((user) => (user.id === id ? updatedUser : user))
  } else if (userCategory === "trainers") {
    trainersData = trainersData.map((user) => (user.id === id ? updatedUser : user))
  } else if (userCategory === "masseurs") {
    masseursData = masseursData.map((user) => (user.id === id ? updatedUser : user))
  } else if (userCategory === "managers") {
    managersData = managersData.map((user) => (user.id === id ? updatedUser : user))
  }

  return updatedUser
}

export const blockUser = async (id: string): Promise<User> => {
  return await updateUser(id, { status: "blocked" })
}

export const unblockUser = async (id: string): Promise<User> => {
  return await updateUser(id, { status: "active" })
}
