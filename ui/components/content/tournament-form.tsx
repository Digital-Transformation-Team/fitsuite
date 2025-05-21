"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export interface Tournament {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  location: string
  registrationUrl?: string
  language: string
  maxParticipants?: number
  currentParticipants?: number
}

interface TournamentFormProps {
  tournament?: Tournament
  onSave: (tournament: Omit<Tournament, "id">) => void
  language: string
}

export function TournamentForm({ tournament, onSave, language }: TournamentFormProps) {
  const [name, setName] = useState(tournament?.name || "")
  const [description, setDescription] = useState(tournament?.description || "")
  const [startDate, setStartDate] = useState<Date>(tournament?.startDate ? new Date(tournament.startDate) : new Date())
  const [endDate, setEndDate] = useState<Date>(
    tournament?.endDate ? new Date(tournament.endDate) : new Date(new Date().setDate(new Date().getDate() + 1)),
  )
  const [status, setStatus] = useState<Tournament["status"]>(tournament?.status || "upcoming")
  const [location, setLocation] = useState(tournament?.location || "")
  const [registrationUrl, setRegistrationUrl] = useState(tournament?.registrationUrl || "")
  const [maxParticipants, setMaxParticipants] = useState(tournament?.maxParticipants?.toString() || "")
  const [currentParticipants, setCurrentParticipants] = useState(tournament?.currentParticipants?.toString() || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status,
      location,
      registrationUrl,
      language,
      maxParticipants: maxParticipants ? Number.parseInt(maxParticipants) : undefined,
      currentParticipants: currentParticipants ? Number.parseInt(currentParticipants) : undefined,
    })
    if (!tournament) {
      // Clear form if it's a new tournament
      setName("")
      setDescription("")
      setStartDate(new Date())
      setEndDate(new Date(new Date().setDate(new Date().getDate() + 1)))
      setStatus("upcoming")
      setLocation("")
      setRegistrationUrl("")
      setMaxParticipants("")
      setCurrentParticipants("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Tournament Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter tournament name"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter tournament description"
            className="min-h-[100px]"
          />
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
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="end-date">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="end-date"
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={(date) => date && setEndDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as Tournament["status"])}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter tournament location"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="max-participants">Maximum Participants</Label>
            <Input
              id="max-participants"
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              placeholder="Enter maximum participants"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="current-participants">Current Participants</Label>
            <Input
              id="current-participants"
              type="number"
              value={currentParticipants}
              onChange={(e) => setCurrentParticipants(e.target.value)}
              placeholder="Enter current participants"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="registration-url">Registration URL</Label>
          <Input
            id="registration-url"
            type="url"
            value={registrationUrl}
            onChange={(e) => setRegistrationUrl(e.target.value)}
            placeholder="Enter registration URL"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">{tournament ? "Update" : "Create"} Tournament</Button>
      </div>
    </form>
  )
}
