import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import {
  fetchActionLogs,
  fetchSystemStatus,
  fetchRolesAndPermissions,
  fetchDataProtectionItems,
  updateRole,
  createRole,
  deleteRole,
  updateDataProtectionItem,
} from "@/api/securityService"
import type { ActionLogEntry, SystemStatusItem, Role, Permission, DataProtectionItem } from "@/types/security"

interface SecurityState {
  actionLogs: {
    data: ActionLogEntry[]
    loading: boolean
    error: string | null
  }
  systemStatus: {
    data: SystemStatusItem[]
    loading: boolean
    error: string | null
    lastUpdated: string | null
  }
  rolesAndPermissions: {
    roles: Role[]
    permissions: Permission[]
    loading: boolean
    error: string | null
  }
  dataProtection: {
    items: DataProtectionItem[]
    loading: boolean
    error: string | null
    overallScore: number
    lastAudit: string | null
    nextAudit: string | null
  }
}

const initialState: SecurityState = {
  actionLogs: {
    data: [],
    loading: false,
    error: null,
  },
  systemStatus: {
    data: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  rolesAndPermissions: {
    roles: [],
    permissions: [],
    loading: false,
    error: null,
  },
  dataProtection: {
    items: [],
    loading: false,
    error: null,
    overallScore: 0,
    lastAudit: null,
    nextAudit: null,
  },
}

// Async thunks
export const fetchActionLogsAsync = createAsyncThunk("security/fetchActionLogs", async () => {
  return await fetchActionLogs()
})

export const fetchSystemStatusAsync = createAsyncThunk("security/fetchSystemStatus", async () => {
  return await fetchSystemStatus()
})

export const fetchRolesAndPermissionsAsync = createAsyncThunk("security/fetchRolesAndPermissions", async () => {
  return await fetchRolesAndPermissions()
})

export const fetchDataProtectionItemsAsync = createAsyncThunk("security/fetchDataProtectionItems", async () => {
  return await fetchDataProtectionItems()
})

export const createRoleAsync = createAsyncThunk(
  "security/createRole",
  async (role: Omit<Role, "id" | "usersCount">) => {
    return await createRole(role)
  },
)

export const updateRoleAsync = createAsyncThunk(
  "security/updateRole",
  async ({ id, roleData }: { id: string; roleData: Omit<Role, "id" | "usersCount"> }) => {
    return await updateRole(id, roleData)
  },
)

export const deleteRoleAsync = createAsyncThunk("security/deleteRole", async (id: string) => {
  await deleteRole(id)
  return id
})

export const updateDataProtectionItemAsync = createAsyncThunk(
  "security/updateDataProtectionItem",
  async ({ id, data }: { id: string; data: Partial<DataProtectionItem> }) => {
    return await updateDataProtectionItem(id, data)
  },
)

// Calculate compliance score
const calculateComplianceScore = (items: DataProtectionItem[]): number => {
  if (items.length === 0) return 0

  const weights = {
    compliant: 1,
    partial: 0.5,
    "non-compliant": 0,
    pending: 0,
  }

  const totalWeight = items.length
  const earnedWeight = items.reduce((sum, item) => sum + weights[item.status], 0)

  return Math.round((earnedWeight / totalWeight) * 100)
}

const securitySlice = createSlice({
  name: "security",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Action Logs
    builder
      .addCase(fetchActionLogsAsync.pending, (state) => {
        state.actionLogs.loading = true
        state.actionLogs.error = null
      })
      .addCase(fetchActionLogsAsync.fulfilled, (state, action: PayloadAction<ActionLogEntry[]>) => {
        state.actionLogs.loading = false
        state.actionLogs.data = action.payload
      })
      .addCase(fetchActionLogsAsync.rejected, (state, action) => {
        state.actionLogs.loading = false
        state.actionLogs.error = action.error.message || "Failed to fetch action logs"
      })

    // System Status
    builder
      .addCase(fetchSystemStatusAsync.pending, (state) => {
        state.systemStatus.loading = true
        state.systemStatus.error = null
      })
      .addCase(fetchSystemStatusAsync.fulfilled, (state, action: PayloadAction<SystemStatusItem[]>) => {
        state.systemStatus.loading = false
        state.systemStatus.data = action.payload
        state.systemStatus.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchSystemStatusAsync.rejected, (state, action) => {
        state.systemStatus.loading = false
        state.systemStatus.error = action.error.message || "Failed to fetch system status"
      })

    // Roles and Permissions
    builder
      .addCase(fetchRolesAndPermissionsAsync.pending, (state) => {
        state.rolesAndPermissions.loading = true
        state.rolesAndPermissions.error = null
      })
      .addCase(
        fetchRolesAndPermissionsAsync.fulfilled,
        (state, action: PayloadAction<{ roles: Role[]; permissions: Permission[] }>) => {
          state.rolesAndPermissions.loading = false
          state.rolesAndPermissions.roles = action.payload.roles
          state.rolesAndPermissions.permissions = action.payload.permissions
        },
      )
      .addCase(fetchRolesAndPermissionsAsync.rejected, (state, action) => {
        state.rolesAndPermissions.loading = false
        state.rolesAndPermissions.error = action.error.message || "Failed to fetch roles and permissions"
      })

    // Create Role
    builder.addCase(createRoleAsync.fulfilled, (state, action: PayloadAction<Role>) => {
      state.rolesAndPermissions.roles.push(action.payload)
    })

    // Update Role
    builder.addCase(updateRoleAsync.fulfilled, (state, action: PayloadAction<Role>) => {
      const index = state.rolesAndPermissions.roles.findIndex((role) => role.id === action.payload.id)
      if (index !== -1) {
        state.rolesAndPermissions.roles[index] = action.payload
      }
    })

    // Delete Role
    builder.addCase(deleteRoleAsync.fulfilled, (state, action: PayloadAction<string>) => {
      state.rolesAndPermissions.roles = state.rolesAndPermissions.roles.filter((role) => role.id !== action.payload)
    })

    // Data Protection
    builder
      .addCase(fetchDataProtectionItemsAsync.pending, (state) => {
        state.dataProtection.loading = true
        state.dataProtection.error = null
      })
      .addCase(
        fetchDataProtectionItemsAsync.fulfilled,
        (
          state,
          action: PayloadAction<{
            items: DataProtectionItem[]
            lastAudit: string
            nextAudit: string
          }>,
        ) => {
          state.dataProtection.loading = false
          state.dataProtection.items = action.payload.items
          state.dataProtection.lastAudit = action.payload.lastAudit
          state.dataProtection.nextAudit = action.payload.nextAudit
          state.dataProtection.overallScore = calculateComplianceScore(action.payload.items)
        },
      )
      .addCase(fetchDataProtectionItemsAsync.rejected, (state, action) => {
        state.dataProtection.loading = false
        state.dataProtection.error = action.error.message || "Failed to fetch data protection items"
      })

    // Update Data Protection Item
    builder.addCase(updateDataProtectionItemAsync.fulfilled, (state, action: PayloadAction<DataProtectionItem>) => {
      const index = state.dataProtection.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        state.dataProtection.items[index] = action.payload
        state.dataProtection.overallScore = calculateComplianceScore(state.dataProtection.items)
      }
    })
  },
})

export default securitySlice.reducer
