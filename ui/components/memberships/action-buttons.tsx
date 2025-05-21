"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { format, addDays } from "date-fns"

export interface ClientMembership {
  id: string
  clientId: string
  membershipTypeId: string
  membershipName: string
  startDate: string
  endDate: string
  status: "active" | "frozen" | "expired" | "cancelled"
  attendanceCount: number
  maxAttendance?: number
  freezeHistory?: {
    startDate: string
    endDate?: string
    reason: string
  }[]
  prolongHistory?: {
    date: string
    days: number
    reason: string
  }[]
}

interface ActionButtonsProps {
  membership: ClientMembership
  onFreeze: (membershipId: string, days: number, reason: string) => void
  onUnfreeze: (membershipId: string) => void
  onProlong: (membershipId: string, days: number, reason: string) => void
  onCancel: (membershipId: string, reason: string) => void
}

export function ActionButtons({ membership, onFreeze, onUnfreeze, onProlong, onCancel }: ActionButtonsProps) {
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false)
  const [prolongDialogOpen, setProlongDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [freezeDays, setFreezeDays] = useState("30")
  const [freezeReason, setFreezeReason] = useState("")
  const [prolongDays, setProlongDays] = useState("30")
  const [prolongReason, setProlongReason] = useState("")
  const [cancelReason, setCancelReason] = useState("")

  const handleFreeze = () => {
    onFreeze(membership.id, Number.parseInt(freezeDays), freezeReason)
    setFreezeDialogOpen(false)
    setFreezeDays("30")
    setFreezeReason("")
  }

  const handleProlong = () => {
    onProlong(membership.id, Number.parseInt(prolongDays), prolongReason)
    setProlongDialogOpen(false)
    setProlongDays("30")
    setProlongReason("")
  }

  const handleCancel = () => {
    onCancel(membership.id, cancelReason)
    setCancelDialogOpen(false)
    setCancelReason("")
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {membership.status === "active" ? (
          <Button size="sm" variant="outline" onClick={() => setFreezeDialogOpen(true)}>
            <Clock className="mr-2 h-4 w-4" />
            Freeze
          </Button>
        ) : membership.status === "frozen" ? (
          <Button size="sm" variant="outline" onClick={() => onUnfreeze(membership.id)}>
            <Clock className="mr-2 h-4 w-4" />
            Unfreeze
          </Button>
        ) : null}

        {(membership.status === "active" || membership.status === "frozen") && (
          <>
            <Button size="sm" variant="outline" onClick={() => setProlongDialogOpen(true)}>
              <Calendar className="mr-2 h-4 w-4" />
              Prolong
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setCancelDialogOpen(true)}>
              <AlertCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </>
        )}
      </div>

      {/* Freeze Dialog */}
      <Dialog open={freezeDialogOpen} onOpenChange={setFreezeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Freeze Membership</DialogTitle>
            <DialogDescription>
              Freezing will pause the membership for the selected period. The end date will be extended accordingly.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="freeze-days">Freeze Duration</Label>
              <RadioGroup
                id="freeze-days"
                value={freezeDays}
                onValueChange={setFreezeDays}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="7" id="freeze-7" />
                  <Label htmlFor="freeze-7">7 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="14" id="freeze-14" />
                  <Label htmlFor="freeze-14">14 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30" id="freeze-30" />
                  <Label htmlFor="freeze-30">30 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="freeze-custom" />
                  <Label htmlFor="freeze-custom">Custom</Label>
                  <Input
                    type="number"
                    min="1"
                    max="90"
                    className="w-20 h-8"
                    placeholder="Days"
                    onClick={() => setFreezeDays("custom")}
                    onChange={(e) => setFreezeDays(e.target.value)}
                    disabled={freezeDays !== "custom"}
                  />
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="freeze-reason">Reason (optional)</Label>
              <Textarea
                id="freeze-reason"
                value={freezeReason}
                onChange={(e) => setFreezeReason(e.target.value)}
                placeholder="Enter reason for freezing"
              />
            </div>
            <div className="grid gap-2">
              <Label>New End Date</Label>
              <div className="p-2 bg-muted rounded-md">
                {format(addDays(new Date(membership.endDate), Number.parseInt(freezeDays) || 0), "MMMM d, yyyy")}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFreezeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFreeze}>Freeze Membership</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prolong Dialog */}
      <Dialog open={prolongDialogOpen} onOpenChange={setProlongDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prolong Membership</DialogTitle>
            <DialogDescription>Extend the membership duration by adding more days to the end date.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="prolong-days">Additional Days</Label>
              <RadioGroup
                id="prolong-days"
                value={prolongDays}
                onValueChange={setProlongDays}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30" id="prolong-30" />
                  <Label htmlFor="prolong-30">30 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60" id="prolong-60" />
                  <Label htmlFor="prolong-60">60 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="90" id="prolong-90" />
                  <Label htmlFor="prolong-90">90 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="prolong-custom" />
                  <Label htmlFor="prolong-custom">Custom</Label>
                  <Input
                    type="number"
                    min="1"
                    className="w-20 h-8"
                    placeholder="Days"
                    onClick={() => setProlongDays("custom")}
                    onChange={(e) => setProlongDays(e.target.value)}
                    disabled={prolongDays !== "custom"}
                  />
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prolong-reason">Reason (optional)</Label>
              <Textarea
                id="prolong-reason"
                value={prolongReason}
                onChange={(e) => setProlongReason(e.target.value)}
                placeholder="Enter reason for prolonging"
              />
            </div>
            <div className="grid gap-2">
              <Label>New End Date</Label>
              <div className="p-2 bg-muted rounded-md">
                {format(addDays(new Date(membership.endDate), Number.parseInt(prolongDays) || 0), "MMMM d, yyyy")}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProlongDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProlong}>Prolong Membership</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Membership</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this membership? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cancel-reason">Reason</Label>
              <Textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancellation"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Go Back
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={!cancelReason.trim()}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
