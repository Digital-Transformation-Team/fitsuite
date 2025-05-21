"use client"

import { useState } from "react"
import { addDays, format, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface Booking {
  id: string
  title: string
  start: string
  end: string
  client: string
  trainer?: string
  court: string
  status: "confirmed" | "pending" | "cancelled"
  color?: string
}

interface BookingCalendarProps {
  bookings: Booking[]
  onBookingClick: (booking: Booking) => void
}

export function BookingCalendar({ bookings, onBookingClick }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week">("week")

  // Generate days for the week view
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start from Monday
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i))

  // Hours for the day
  const hours = Array.from({ length: 14 }).map((_, i) => i + 7) // 7 AM to 8 PM

  // Filter bookings for the current week
  const currentBookings = bookings.filter((booking) => {
    const bookingDate = parseISO(booking.start)
    return weekDays.some((day) => isSameDay(day, bookingDate))
  })

  // Navigate to previous/next week
  const navigatePrevious = () => setCurrentDate(subWeeks(currentDate, 1))
  const navigateNext = () => setCurrentDate(addWeeks(currentDate, 1))
  const navigateToday = () => setCurrentDate(new Date())

  // Get bookings for a specific day and hour
  const getBookingsForTimeSlot = (day: Date, hour: number) => {
    return currentBookings.filter((booking) => {
      const bookingDate = parseISO(booking.start)
      const bookingHour = bookingDate.getHours()
      return isSameDay(day, bookingDate) && bookingHour === hour
    })
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={navigateToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold">
            {format(startDate, "MMMM d, yyyy")} - {format(addDays(startDate, 6), "MMMM d, yyyy")}
          </h2>
          <Select value={view} onValueChange={(value: "day" | "week") => setView(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-8 border rounded-md overflow-hidden">
          {/* Time column */}
          <div className="border-r">
            <div className="h-12 border-b bg-muted flex items-center justify-center font-medium">Time</div>
            {hours.map((hour) => (
              <div key={hour} className="h-20 border-b flex items-center justify-center text-sm text-muted-foreground">
                {hour % 12 === 0 ? 12 : hour % 12} {hour >= 12 ? "PM" : "AM"}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {weekDays.map((day) => (
            <div key={day.toString()} className="border-r last:border-r-0">
              <div
                className={cn(
                  "h-12 border-b flex flex-col items-center justify-center font-medium",
                  isSameDay(day, new Date()) && "bg-primary/10",
                )}
              >
                <div>{format(day, "EEE")}</div>
                <div className={cn("text-sm", isSameDay(day, new Date()) && "text-primary font-bold")}>
                  {format(day, "d")}
                </div>
              </div>

              {/* Time slots */}
              {hours.map((hour) => {
                const bookingsForSlot = getBookingsForTimeSlot(day, hour)
                return (
                  <div
                    key={`${day}-${hour}`}
                    className={cn(
                      "h-20 border-b relative",
                      isSameDay(day, new Date()) && "bg-primary/5",
                      hour >= 9 && hour <= 17 && "bg-background",
                    )}
                  >
                    {/* Render bookings in this time slot */}
                    <TooltipProvider>
                      {bookingsForSlot.map((booking) => (
                        <Tooltip key={booking.id}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "absolute inset-x-1 rounded-md p-1 text-xs cursor-pointer",
                                booking.status === "confirmed"
                                  ? "bg-green-100 border border-green-300 text-green-800"
                                  : booking.status === "pending"
                                    ? "bg-yellow-100 border border-yellow-300 text-yellow-800"
                                    : "bg-red-100 border border-red-300 text-red-800",
                              )}
                              style={{
                                top: `${(parseISO(booking.start).getMinutes() / 60) * 100}%`,
                                height: "80%",
                              }}
                              onClick={() => onBookingClick(booking)}
                            >
                              <div className="font-medium truncate">{booking.title}</div>
                              <div className="truncate">{booking.client}</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-medium">{booking.title}</p>
                              <p>Client: {booking.client}</p>
                              <p>Court: {booking.court}</p>
                              {booking.trainer && <p>Trainer: {booking.trainer}</p>}
                              <p>Status: {booking.status}</p>
                              <p>
                                Time: {format(parseISO(booking.start), "h:mm a")} -{" "}
                                {format(parseISO(booking.end), "h:mm a")}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
