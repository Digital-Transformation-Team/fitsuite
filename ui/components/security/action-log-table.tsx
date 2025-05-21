"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Filter, ChevronDown, AlertCircle, CheckCircle, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

export type ActionStatus = "success" | "warning" | "error" | "info"

export interface ActionLogEntry {
  id: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  action: string
  timestamp: string
  ipAddress: string
  status: ActionStatus
  details?: string
}

interface ActionLogTableProps {
  logs: ActionLogEntry[]
  onExport?: () => void
}

export function ActionLogTable({ logs, onExport }: ActionLogTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ActionStatus | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [userFilter, setUserFilter] = useState<string | "all">("all")
  const itemsPerPage = 10

  // Get unique users for filtering
  const uniqueUsers = Array.from(new Set(logs.map((log) => log.user.name)))

  // Filter logs based on search query and filters
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery)

    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    const matchesUser = userFilter === "all" || log.user.name === userFilter

    return matchesSearch && matchesStatus && matchesUser
  })

  // Paginate logs
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search logs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ActionStatus | "all")}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>

          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>User</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {uniqueUsers.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {onExport && (
            <Button variant="outline" onClick={onExport}>
              Export Logs
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="font-medium">{log.user.name}</div>
                    <div className="text-xs text-muted-foreground">{log.user.role}</div>
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss")}</TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                  <TableCell>
                    <StatusBadge status={log.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {log.details && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Details <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[300px]">
                          <DropdownMenuLabel>Action Details</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <div className="p-2 text-sm">
                            <p className="whitespace-pre-wrap">{log.details}</p>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage((p) => Math.max(1, p - 1))
                }}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 3 + i
                if (pageNum > totalPages) pageNum = totalPages - (4 - i)
              }
              return (
                <PaginationItem key={i}>
                  {pageNum <= totalPages && (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(pageNum)
                      }}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              )
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }}
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

interface StatusBadgeProps {
  status: ActionStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant={
        status === "success"
          ? "success"
          : status === "warning"
            ? "outline"
            : status === "error"
              ? "destructive"
              : "secondary"
      }
      className="flex items-center gap-1"
    >
      {status === "success" ? (
        <>
          <CheckCircle className="h-3 w-3" /> Success
        </>
      ) : status === "warning" ? (
        <>
          <AlertCircle className="h-3 w-3" /> Warning
        </>
      ) : status === "error" ? (
        <>
          <AlertCircle className="h-3 w-3" /> Error
        </>
      ) : (
        <>
          <Info className="h-3 w-3" /> Info
        </>
      )}
    </Badge>
  )
}
