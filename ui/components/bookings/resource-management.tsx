"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FormModal } from "./form-modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Types for resources
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
  status: "available" | "blocked" | "maintenance"
}

interface ResourceManagementProps {
  trainers: Trainer[]
  masseurs: Masseur[]
  courts: Court[]
  onUpdateTrainer: (trainer: Trainer) => void
  onAddTrainer: (trainer: Trainer) => void
  onRemoveTrainer: (trainerId: string) => void
  onUpdateMasseur: (masseur: Masseur) => void
  onAddMasseur: (masseur: Masseur) => void
  onRemoveMasseur: (masseurId: string) => void
  onUpdateCourt: (court: Court) => void
  onAddCourt: (court: Court) => void
  onRemoveCourt: (courtId: string) => void
}

export function ResourceManagement({
  trainers,
  masseurs,
  courts,
  onUpdateTrainer,
  onAddTrainer,
  onRemoveTrainer,
  onUpdateMasseur,
  onAddMasseur,
  onRemoveMasseur,
  onUpdateCourt,
  onAddCourt,
  onRemoveCourt,
}: ResourceManagementProps) {
  const [activeTab, setActiveTab] = useState("trainers")
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false)
  const [isMasseurModalOpen, setIsMasseurModalOpen] = useState(false)
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false)

  // Toggle court status
  const toggleCourtStatus = (court: Court) => {
    const newStatus =
      court.status === "available" ? "blocked" : court.status === "blocked" ? "maintenance" : "available"
    onUpdateCourt({ ...court, status: newStatus })
  }

  // Toggle staff status
  const toggleStaffStatus = (staff: Trainer | Masseur, type: "trainer" | "masseur") => {
    const newStatus = staff.status === "active" ? "inactive" : "active"
    if (type === "trainer") {
      onUpdateTrainer({ ...(staff as Trainer), status: newStatus })
    } else {
      onUpdateMasseur({ ...(staff as Masseur), status: newStatus })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Management</CardTitle>
        <CardDescription>Manage trainers, masseurs, and courts for bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="masseurs">Masseurs</TabsTrigger>
            <TabsTrigger value="courts">Courts</TabsTrigger>
          </TabsList>

          <TabsContent value="trainers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Trainers</h3>
              <Button size="sm" onClick={() => setIsTrainerModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Trainer
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainers.map((trainer) => (
                    <TableRow key={trainer.id}>
                      <TableCell className="font-medium">{trainer.name}</TableCell>
                      <TableCell>{trainer.specialization}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {trainer.availability.map((day) => (
                            <Badge key={day} variant="outline" className="text-xs">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={trainer.status === "active"}
                            onCheckedChange={() => toggleStaffStatus(trainer, "trainer")}
                          />
                          <Label>{trainer.status === "active" ? "Active" : "Inactive"}</Label>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveTrainer(trainer.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="masseurs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Masseurs</h3>
              <Button size="sm" onClick={() => setIsMasseurModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Masseur
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masseurs.map((masseur) => (
                    <TableRow key={masseur.id}>
                      <TableCell className="font-medium">{masseur.name}</TableCell>
                      <TableCell>{masseur.specialization}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {masseur.availability.map((day) => (
                            <Badge key={day} variant="outline" className="text-xs">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={masseur.status === "active"}
                            onCheckedChange={() => toggleStaffStatus(masseur, "masseur")}
                          />
                          <Label>{masseur.status === "active" ? "Active" : "Inactive"}</Label>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveMasseur(masseur.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="courts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Courts & Rooms</h3>
              <Button size="sm" onClick={() => setIsCourtModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Court
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courts.map((court) => (
                    <TableRow key={court.id}>
                      <TableCell className="font-medium">{court.name}</TableCell>
                      <TableCell>{court.type}</TableCell>
                      <TableCell>{court.capacity}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={court.status === "available"}
                            onCheckedChange={() => toggleCourtStatus(court)}
                          />
                          <Badge
                            variant={
                              court.status === "available"
                                ? "success"
                                : court.status === "blocked"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveCourt(court.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Trainer Form Modal */}
      <FormModal
        title="Add Trainer"
        isOpen={isTrainerModalOpen}
        onClose={() => setIsTrainerModalOpen(false)}
        onSubmit={(data) => {
          onAddTrainer({
            id: Math.random().toString(36).substring(7),
            name: data.name,
            specialization: data.specialization,
            availability: data.availability.split(",").map((day) => day.trim()),
            status: "active",
          })
          setIsTrainerModalOpen(false)
        }}
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Enter name" },
          {
            name: "specialization",
            label: "Specialization",
            type: "text",
            placeholder: "Enter specialization",
          },
          {
            name: "availability",
            label: "Availability",
            type: "text",
            placeholder: "Monday, Tuesday, Wednesday",
            description: "Enter days separated by commas",
          },
        ]}
      />

      {/* Masseur Form Modal */}
      <FormModal
        title="Add Masseur"
        isOpen={isMasseurModalOpen}
        onClose={() => setIsMasseurModalOpen(false)}
        onSubmit={(data) => {
          onAddMasseur({
            id: Math.random().toString(36).substring(7),
            name: data.name,
            specialization: data.specialization,
            availability: data.availability.split(",").map((day) => day.trim()),
            status: "active",
          })
          setIsMasseurModalOpen(false)
        }}
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Enter name" },
          {
            name: "specialization",
            label: "Specialization",
            type: "text",
            placeholder: "Enter specialization",
          },
          {
            name: "availability",
            label: "Availability",
            type: "text",
            placeholder: "Monday, Tuesday, Wednesday",
            description: "Enter days separated by commas",
          },
        ]}
      />

      {/* Court Form Modal */}
      <FormModal
        title="Add Court"
        isOpen={isCourtModalOpen}
        onClose={() => setIsCourtModalOpen(false)}
        onSubmit={(data) => {
          onAddCourt({
            id: Math.random().toString(36).substring(7),
            name: data.name,
            type: data.type,
            capacity: Number.parseInt(data.capacity),
            status: "available",
          })
          setIsCourtModalOpen(false)
        }}
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Enter court name" },
          {
            name: "type",
            label: "Type",
            type: "select",
            options: ["Tennis", "Basketball", "Squash", "Massage Room", "Yoga Studio"],
          },
          { name: "capacity", label: "Capacity", type: "number", placeholder: "Enter capacity" },
        ]}
      />
    </Card>
  )
}
