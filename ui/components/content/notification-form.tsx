"use client"

import type React from "react"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export interface Notification {
  id: string
  title: string
  message: string
  targetAudience: "all" | "members" | "staff" | "custom"
  customGroups?: string[]
  scheduledFor?: string
  language: string
}

interface NotificationFormProps {
  notification?: Notification
  onSend: (notification: Omit<Notification, "id">) => void
  language: string
}

export function NotificationForm({ notification, onSend, language }: NotificationFormProps) {
  const [title, setTitle] = useState(notification?.title || "")
  const [message, setMessage] = useState(notification?.message || "")
  const [targetAudience, setTargetAudience] = useState<Notification["targetAudience"]>(
    notification?.targetAudience || "all",
  )
  const [customGroups, setCustomGroups] = useState<string[]>(notification?.customGroups || [])
  const [scheduledFor, setScheduledFor] = useState(notification?.scheduledFor || "")

  // Available groups for custom targeting
  const availableGroups = [
    { id: "premium", label: "Premium Members" },
    { id: "standard", label: "Standard Members" },
    { id: "trial", label: "Trial Members" },
    { id: "inactive", label: "Inactive Members" },
    { id: "trainers", label: "Trainers" },
    { id: "masseurs", label: "Masseurs" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSend({
      title,
      message,
      targetAudience,
      customGroups: targetAudience === "custom" ? customGroups : undefined,
      scheduledFor: scheduledFor || undefined,
      language,
    })
    if (!notification) {
      // Clear form if it's a new notification
      setTitle("")
      setMessage("")
      setTargetAudience("all")
      setCustomGroups([])
      setScheduledFor("")
    }
  }

  const toggleGroup = (groupId: string) => {
    setCustomGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Notification Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message"
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="target-audience">Target Audience</Label>
          <Select
            value={targetAudience}
            onValueChange={(value) => setTargetAudience(value as Notification["targetAudience"])}
          >
            <SelectTrigger id="target-audience">
              <SelectValue placeholder="Select target audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="members">Members Only</SelectItem>
              <SelectItem value="staff">Staff Only</SelectItem>
              <SelectItem value="custom">Custom Groups</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {targetAudience === "custom" && (
          <div className="grid gap-2 border rounded-md p-4">
            <Label>Custom Groups</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableGroups.map((group) => (
                <div key={group.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`group-${group.id}`}
                    checked={customGroups.includes(group.id)}
                    onCheckedChange={() => toggleGroup(group.id)}
                  />
                  <Label htmlFor={`group-${group.id}`} className="cursor-pointer">
                    {group.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="scheduled-for">Schedule (Optional)</Label>
          <Input
            id="scheduled-for"
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            placeholder="Schedule for later"
          />
          <p className="text-sm text-muted-foreground">Leave empty to send immediately</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Send Notification</Button>
      </div>
    </form>
  )
}
