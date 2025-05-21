"use client"

import type React from "react"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Calendar, Clock, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ClientMembership } from "./action-buttons"

export interface AttendanceRecord {
  id: string
  clientMembershipId: string
  date: string
  checkInTime: string
  checkOutTime?: string
  facility: string
  notes?: string
}

interface AttendanceTrackerProps {
  membership: ClientMembership
  attendanceRecords: AttendanceRecord[]
  onAddAttendance: (record: Omit<AttendanceRecord, "id">) => void
}

export function AttendanceTracker({ membership, attendanceRecords, onAddAttendance }: AttendanceTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [facilityFilter, setFacilityFilter] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRecord, setNewRecord] = useState<Partial<AttendanceRecord>>({
    clientMembershipId: membership.id,
    date: format(new Date(), "yyyy-MM-dd"),
    checkInTime: format(new Date(), "HH:mm"),
    facility: "",
    notes: "",
  })

  // Filter records
  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch =
      searchQuery === "" ||
      record.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.notes && record.notes.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFacility = facilityFilter === "all" || record.facility === facilityFilter

    return matchesSearch && matchesFacility
  })

  // Get unique facilities for filter
  const facilities = Array.from(new Set(attendanceRecords.map((record) => record.facility)))

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newRecord.facility && newRecord.date && newRecord.checkInTime) {
      onAddAttendance({
        clientMembershipId: membership.id,
        date: newRecord.date,
        checkInTime: newRecord.checkInTime,
        checkOutTime: newRecord.checkOutTime,
        facility: newRecord.facility,
        notes: newRecord.notes,
      })
      setShowAddForm(false)
      setNewRecord({
        clientMembershipId: membership.id,
        date: format(new Date(), "yyyy-MM-dd"),
        checkInTime: format(new Date(), "HH:mm"),
        facility: "",
        notes: "",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Attendance Tracker</CardTitle>
            <CardDescription>
              {membership.attendanceCount} visits
              {membership.maxAttendance ? ` out of ${membership.maxAttendance}` : ""}
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : "Add Attendance"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm ? (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 border rounded-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="facility" className="text-sm font-medium">
                  Facility
                </label>
                <Input
                  id="facility"
                  type="text"
                  value={newRecord.facility}
                  onChange={(e) => setNewRecord({ ...newRecord, facility: e.target.value })}
                  placeholder="Gym, Pool, Tennis Court, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="checkInTime" className="text-sm font-medium">
                  Check-in Time
                </label>
                <Input
                  id="checkInTime"
                  type="time"
                  value={newRecord.checkInTime}
                  onChange={(e) => setNewRecord({ ...newRecord, checkInTime: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="checkOutTime" className="text-sm font-medium">
                  Check-out Time (Optional)
                </label>
                <Input
                  id="checkOutTime"
                  type="time"
                  value={newRecord.checkOutTime}
                  onChange={(e) => setNewRecord({ ...newRecord, checkOutTime: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes (Optional)
                </label>
                <Input
                  id="notes"
                  type="text"
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  placeholder="Any additional notes"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Add Record</Button>
            </div>
          </form>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search attendance records..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={facilityFilter} onValueChange={setFacilityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by facility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Facilities</SelectItem>
              {facilities.map((facility) => (
                <SelectItem key={facility} value={facility}>
                  {facility}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
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
                <TableHead>Facility</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(parseISO(record.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {record.checkInTime}
                      {record.checkOutTime ? ` - ${record.checkOutTime}` : ""}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.facility}</Badge>
                    </TableCell>
                    <TableCell>{record.notes || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
