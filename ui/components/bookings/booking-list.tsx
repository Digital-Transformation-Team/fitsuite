"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Calendar, Clock, Filter, MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Booking } from "./booking-calendar"

interface BookingListProps {
  bookings: Booking[]
  trainers: { id: string; name: string }[]
  courts: { id: string; name: string }[]
  onEditBooking: (booking: Booking) => void
  onCancelBooking: (bookingId: string) => void
}

export function BookingList({ bookings, trainers, courts, onEditBooking, onCancelBooking }: BookingListProps) {
  const [filteredBookings, setFilteredBookings] = useState(bookings)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTrainer, setSelectedTrainer] = useState<string>("all")
  const [selectedCourt, setSelectedCourt] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Apply filters
  const applyFilters = () => {
    let filtered = [...bookings]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.client.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Trainer filter
    if (selectedTrainer !== "all") {
      filtered = filtered.filter((booking) => booking.trainer === selectedTrainer)
    }

    // Court filter
    if (selectedCourt !== "all") {
      filtered = filtered.filter((booking) => booking.court === selectedCourt)
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((booking) => booking.status === selectedStatus)
    }

    setFilteredBookings(filtered)
  }

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedTrainer("all")
    setSelectedCourt("all")
    setSelectedStatus("all")
    setFilteredBookings(bookings)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Booking List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search bookings..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Filter Bookings</h4>
                      <p className="text-sm text-muted-foreground">
                        Narrow down bookings based on trainer, court, and status.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <label htmlFor="trainer">Trainer</label>
                        <Select value={selectedTrainer} onValueChange={setSelectedTrainer} className="col-span-2">
                          <SelectTrigger id="trainer">
                            <SelectValue placeholder="Select trainer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Trainers</SelectItem>
                            {trainers.map((trainer) => (
                              <SelectItem key={trainer.id} value={trainer.name}>
                                {trainer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <label htmlFor="court">Court</label>
                        <Select value={selectedCourt} onValueChange={setSelectedCourt} className="col-span-2">
                          <SelectTrigger id="court">
                            <SelectValue placeholder="Select court" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Courts</SelectItem>
                            {courts.map((court) => (
                              <SelectItem key={court.id} value={court.name}>
                                {court.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <label htmlFor="status">Status</label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus} className="col-span-2">
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={resetFilters}>
                        Reset
                      </Button>
                      <Button size="sm" onClick={applyFilters}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Time
                    </div>
                  </TableHead>
                  <TableHead>Court</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.title}</TableCell>
                      <TableCell>{booking.client}</TableCell>
                      <TableCell>{format(parseISO(booking.start), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        {format(parseISO(booking.start), "h:mm a")} - {format(parseISO(booking.end), "h:mm a")}
                      </TableCell>
                      <TableCell>{booking.court}</TableCell>
                      <TableCell>{booking.trainer || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "success"
                              : booking.status === "pending"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEditBooking(booking)}>Edit booking</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.alert(`View details for ${booking.title}`)}>
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => onCancelBooking(booking.id)}
                              disabled={booking.status === "cancelled"}
                            >
                              Cancel booking
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
