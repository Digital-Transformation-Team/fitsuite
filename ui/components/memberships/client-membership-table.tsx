"use client"

import { useState } from "react"
import { format, parseISO, differenceInDays } from "date-fns"
import { Search, Calendar, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ClientMembership } from "./action-buttons"
import { ActionButtons } from "./action-buttons"

interface ClientMembershipTableProps {
  memberships: ClientMembership[]
  onFreeze: (membershipId: string, days: number, reason: string) => void
  onUnfreeze: (membershipId: string) => void
  onProlong: (membershipId: string, days: number, reason: string) => void
  onCancel: (membershipId: string, reason: string) => void
  onViewDetails: (membership: ClientMembership) => void
  onViewAttendance: (membership: ClientMembership) => void
}

export function ClientMembershipTable({
  memberships,
  onFreeze,
  onUnfreeze,
  onProlong,
  onCancel,
  onViewDetails,
  onViewAttendance,
}: ClientMembershipTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter memberships
  const filteredMemberships = memberships.filter((membership) => {
    const matchesSearch =
      searchQuery === "" || membership.membershipName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || membership.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate days remaining and progress
  const calculateDaysRemaining = (endDate: string) => {
    const end = parseISO(endDate)
    const today = new Date()
    return Math.max(0, differenceInDays(end, today))
  }

  const calculateProgress = (membership: ClientMembership) => {
    if (membership.maxAttendance) {
      return (membership.attendanceCount / membership.maxAttendance) * 100
    }

    const start = parseISO(membership.startDate)
    const end = parseISO(membership.endDate)
    const today = new Date()

    const totalDays = differenceInDays(end, start)
    const daysElapsed = differenceInDays(today, start)

    return Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search memberships..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="frozen">Frozen</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membership</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Dates
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMemberships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No memberships found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMemberships.map((membership) => (
                <TableRow key={membership.id}>
                  <TableCell className="font-medium">{membership.membershipName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Start: {format(parseISO(membership.startDate), "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        End: {format(parseISO(membership.endDate), "MMM d, yyyy")}
                      </span>
                      {membership.status === "active" && (
                        <span className="text-xs font-medium mt-1">
                          {calculateDaysRemaining(membership.endDate)} days remaining
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        membership.status === "active"
                          ? "success"
                          : membership.status === "frozen"
                            ? "outline"
                            : membership.status === "expired"
                              ? "secondary"
                              : "destructive"
                      }
                    >
                      {membership.status.charAt(0).toUpperCase() + membership.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>
                          {membership.maxAttendance
                            ? `${membership.attendanceCount}/${membership.maxAttendance} visits`
                            : `${Math.round(calculateProgress(membership))}% used`}
                        </span>
                      </div>
                      <Progress value={calculateProgress(membership)} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ActionButtons
                        membership={membership}
                        onFreeze={onFreeze}
                        onUnfreeze={onUnfreeze}
                        onProlong={onProlong}
                        onCancel={onCancel}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onViewDetails(membership)}>View details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewAttendance(membership)}>
                            View attendance
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
