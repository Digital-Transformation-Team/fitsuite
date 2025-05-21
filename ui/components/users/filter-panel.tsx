"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

interface FilterPanelProps {
  onFilterChange: (filters: any) => void
  userType: "clients" | "staff"
}

export function FilterPanel({ onFilterChange, userType }: FilterPanelProps) {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    subscription: "all",
    activity: "all",
    onlyActive: false,
  })

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Filters</h3>
        <p className="text-sm text-muted-foreground">Narrow down the list of {userType} based on specific criteria.</p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {userType === "clients" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="subscription">Subscription</Label>
              <Select value={filters.subscription} onValueChange={(value) => handleFilterChange("subscription", value)}>
                <SelectTrigger id="subscription">
                  <SelectValue placeholder="Select subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscriptions</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Activity</Label>
              <Select value={filters.activity} onValueChange={(value) => handleFilterChange("activity", value)}>
                <SelectTrigger id="activity">
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activity</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="active-only"
            checked={filters.onlyActive}
            onCheckedChange={(checked) => handleFilterChange("onlyActive", checked)}
          />
          <Label htmlFor="active-only">Show active users only</Label>
        </div>
      </div>
      <Separator />
      <Button
        className="w-full"
        onClick={() => {
          const resetFilters = {
            search: "",
            status: "all",
            subscription: "all",
            activity: "all",
            onlyActive: false,
          }
          setFilters(resetFilters)
          onFilterChange(resetFilters)
        }}
        variant="outline"
      >
        Reset Filters
      </Button>
    </div>
  )
}
