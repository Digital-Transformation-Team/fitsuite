"use client"

import type React from "react"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { MembershipType } from "./membership-card"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
}

interface AssignMembershipFormProps {
  clients: Client[]
  membershipTypes: MembershipType[]
  onAssign: (data: {
    clientId: string
    membershipTypeId: string
    startDate: Date
    endDate: Date
    notes?: string
  }) => void
  onCancel: () => void
}

export function AssignMembershipForm({ clients, membershipTypes, onAssign, onCancel }: AssignMembershipFormProps) {
  const [clientId, setClientId] = useState("")
  const [membershipTypeId, setMembershipTypeId] = useState("")
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [notes, setNotes] = useState("")

  // Update end date when membership type or start date changes
  const updateEndDate = (membershipId: string, start: Date) => {
    const membership = membershipTypes.find((m) => m.id === membershipId)
    if (membership) {
      setEndDate(addDays(start, membership.duration))
    }
  }

  const handleMembershipChange = (id: string) => {
    setMembershipTypeId(id)
    updateEndDate(id, startDate)
  }

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDate(date)
      if (membershipTypeId) {
        updateEndDate(membershipTypeId, date)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (clientId && membershipTypeId && startDate && endDate) {
      onAssign({
        clientId,
        membershipTypeId,
        startDate,
        endDate,
        notes: notes || undefined,
      })
    }
  }

  const selectedMembership = membershipTypes.find((m) => m.id === membershipTypeId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Membership</CardTitle>
        <CardDescription>Assign a membership to a client</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="assign-membership-form" className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="client">Client</Label>
            <Select value={clientId} onValueChange={setClientId} required>
              <SelectTrigger id="client">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="membership-type">Membership Type</Label>
            <Select value={membershipTypeId} onValueChange={handleMembershipChange} required>
              <SelectTrigger id="membership-type">
                <SelectValue placeholder="Select membership type" />
              </SelectTrigger>
              <SelectContent>
                {membershipTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name} ({type.duration} days)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={handleStartDateChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <div className="p-2 bg-muted rounded-md">
                {endDate ? format(endDate, "PPP") : "Select a membership type and start date"}
              </div>
            </div>
          </div>

          {selectedMembership && (
            <div className="p-4 border rounded-md bg-muted/50">
              <h3 className="font-medium mb-2">Selected Membership Details</h3>
              <p className="text-sm mb-1">
                <span className="font-medium">Name:</span> {selectedMembership.name}
              </p>
              <p className="text-sm mb-1">
                <span className="font-medium">Duration:</span> {selectedMembership.duration} days
              </p>
              {selectedMembership.maxAttendance && (
                <p className="text-sm mb-1">
                  <span className="font-medium">Max Visits:</span> {selectedMembership.maxAttendance}
                </p>
              )}
              <p className="text-sm">
                <span className="font-medium">Price:</span> ${selectedMembership.price.toFixed(2)}
              </p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" form="assign-membership-form" disabled={!clientId || !membershipTypeId || !startDate}>
          Assign Membership
        </Button>
      </CardFooter>
    </Card>
  )
}
