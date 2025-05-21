"use client"
import { MoreHorizontal, Shield, ShieldAlert, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "blocked"
  lastActive?: string
  subscription?: string
}

interface UserTableProps {
  users: User[]
  onBlockUser: (userId: string) => void
  onUnblockUser: (userId: string) => void
}

export function UserTable({ users, onBlockUser, onUnblockUser }: UserTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {user.role === "Admin" ? (
                    <ShieldAlert className="h-4 w-4 text-red-500" />
                  ) : user.role === "Manager" ? (
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Shield className="h-4 w-4 text-gray-500" />
                  )}
                  {user.role}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.status === "active" ? "success" : user.status === "inactive" ? "outline" : "destructive"
                  }
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
                    <DropdownMenuItem onClick={() => window.alert(`View ${user.name}`)}>View details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.alert(`Edit ${user.name}`)}>Edit user</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.status === "blocked" ? (
                      <DropdownMenuItem className="text-green-600" onClick={() => onUnblockUser(user.id)}>
                        Unblock user
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-red-600" onClick={() => onBlockUser(user.id)}>
                        Block user
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
