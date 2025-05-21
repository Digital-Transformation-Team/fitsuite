"use client"

import type { User } from "./user-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserCardProps {
  user: User
  onBlockUser: (userId: string) => void
  onUnblockUser: (userId: string) => void
}

export function UserCard({ user, onBlockUser, onUnblockUser }: UserCardProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${initials}`} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Badge
          className="ml-auto"
          variant={user.status === "active" ? "success" : user.status === "inactive" ? "outline" : "destructive"}
        >
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Role</div>
          <div>{user.role}</div>
          {user.lastActive && (
            <>
              <div className="text-muted-foreground">Last Active</div>
              <div>{user.lastActive}</div>
            </>
          )}
          {user.subscription && (
            <>
              <div className="text-muted-foreground">Subscription</div>
              <div>{user.subscription}</div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {user.status === "blocked" ? (
          <Button variant="outline" size="sm" className="w-full text-green-600" onClick={() => onUnblockUser(user.id)}>
            Unblock User
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="w-full text-red-600" onClick={() => onBlockUser(user.id)}>
            Block User
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
