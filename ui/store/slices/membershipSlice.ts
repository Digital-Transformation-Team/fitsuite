import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import {
  fetchMembershipTypes,
  fetchClientMemberships,
  assignMembership,
  freezeMembership,
  unfreezeMembership,
  prolongMembership,
  cancelMembership,
  addAttendance,
} from "@/api/membershipService"
import type { MembershipType, ClientMembership, AttendanceRecord } from "@/types/membership"

interface MembershipState {
  membershipTypes: MembershipType[]
  clientMemberships: ClientMembership[]
  attendanceRecords: AttendanceRecord[]
  loading: boolean
  error: string | null
}

const initialState: MembershipState = {
  membershipTypes: [],
  clientMemberships: [],
  attendanceRecords: [],
  loading: false,
  error: null,
}

export const fetchMembershipTypesAsync = createAsyncThunk("memberships/fetchMembershipTypes", async () => {
  return await fetchMembershipTypes()
})

export const fetchClientMembershipsAsync = createAsyncThunk("memberships/fetchClientMemberships", async () => {
  return await fetchClientMemberships()
})

export const assignMembershipAsync = createAsyncThunk(
  "memberships/assignMembership",
  async (data: {
    clientId: string
    membershipTypeId: string
    startDate: Date
    endDate: Date
    notes?: string
  }) => {
    return await assignMembership(data)
  },
)

export const freezeMembershipAsync = createAsyncThunk(
  "memberships/freezeMembership",
  async ({ membershipId, days, reason }: { membershipId: string; days: number; reason: string }) => {
    return await freezeMembership(membershipId, days, reason)
  },
)

export const unfreezeMembershipAsync = createAsyncThunk(
  "memberships/unfreezeMembership",
  async (membershipId: string) => {
    return await unfreezeMembership(membershipId)
  },
)

export const prolongMembershipAsync = createAsyncThunk(
  "memberships/prolongMembership",
  async ({ membershipId, days, reason }: { membershipId: string; days: number; reason: string }) => {
    return await prolongMembership(membershipId, days, reason)
  },
)

export const cancelMembershipAsync = createAsyncThunk(
  "memberships/cancelMembership",
  async ({ membershipId, reason }: { membershipId: string; reason: string }) => {
    return await cancelMembership(membershipId, reason)
  },
)

export const addAttendanceAsync = createAsyncThunk(
  "memberships/addAttendance",
  async (record: Omit<AttendanceRecord, "id">) => {
    return await addAttendance(record)
  },
)

const membershipSlice = createSlice({
  name: "memberships",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembershipTypesAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMembershipTypesAsync.fulfilled, (state, action: PayloadAction<MembershipType[]>) => {
        state.loading = false
        state.membershipTypes = action.payload
      })
      .addCase(fetchMembershipTypesAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch membership types"
      })
      .addCase(
        fetchClientMembershipsAsync.fulfilled,
        (
          state,
          action: PayloadAction<{
            memberships: ClientMembership[]
            attendanceRecords: AttendanceRecord[]
          }>,
        ) => {
          state.clientMemberships = action.payload.memberships
          state.attendanceRecords = action.payload.attendanceRecords
        },
      )
      .addCase(assignMembershipAsync.fulfilled, (state, action: PayloadAction<ClientMembership>) => {
        state.clientMemberships.push(action.payload)
      })
      .addCase(freezeMembershipAsync.fulfilled, (state, action: PayloadAction<ClientMembership>) => {
        const index = state.clientMemberships.findIndex((m) => m.id === action.payload.id)
        if (index !== -1) {
          state.clientMemberships[index] = action.payload
        }
      })
      .addCase(unfreezeMembershipAsync.fulfilled, (state, action: PayloadAction<ClientMembership>) => {
        const index = state.clientMemberships.findIndex((m) => m.id === action.payload.id)
        if (index !== -1) {
          state.clientMemberships[index] = action.payload
        }
      })
      .addCase(prolongMembershipAsync.fulfilled, (state, action: PayloadAction<ClientMembership>) => {
        const index = state.clientMemberships.findIndex((m) => m.id === action.payload.id)
        if (index !== -1) {
          state.clientMemberships[index] = action.payload
        }
      })
      .addCase(cancelMembershipAsync.fulfilled, (state, action: PayloadAction<ClientMembership>) => {
        const index = state.clientMemberships.findIndex((m) => m.id === action.payload.id)
        if (index !== -1) {
          state.clientMemberships[index] = action.payload
        }
      })
      .addCase(
        addAttendanceAsync.fulfilled,
        (
          state,
          action: PayloadAction<{
            record: AttendanceRecord
            updatedMembership: ClientMembership
          }>,
        ) => {
          state.attendanceRecords.push(action.payload.record)

          const membershipIndex = state.clientMemberships.findIndex((m) => m.id === action.payload.updatedMembership.id)
          if (membershipIndex !== -1) {
            state.clientMemberships[membershipIndex] = action.payload.updatedMembership
          }
        },
      )
  },
})

export default membershipSlice.reducer
