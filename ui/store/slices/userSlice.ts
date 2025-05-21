import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { fetchUsers, updateUser, blockUser, unblockUser } from "@/api/userService"
import type { User } from "@/types/user"

interface UserState {
  clients: User[]
  trainers: User[]
  masseurs: User[]
  managers: User[]
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  clients: [],
  trainers: [],
  masseurs: [],
  managers: [],
  loading: false,
  error: null,
}

export const fetchUsersAsync = createAsyncThunk("users/fetchUsers", async () => {
  return await fetchUsers()
})

export const updateUserAsync = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }: { id: string; userData: Partial<User> }) => {
    return await updateUser(id, userData)
  },
)

export const blockUserAsync = createAsyncThunk("users/blockUser", async (id: string) => {
  return await blockUser(id)
})

export const unblockUserAsync = createAsyncThunk("users/unblockUser", async (id: string) => {
  return await unblockUser(id)
})

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchUsersAsync.fulfilled,
        (
          state,
          action: PayloadAction<{
            clients: User[]
            trainers: User[]
            masseurs: User[]
            managers: User[]
          }>,
        ) => {
          state.loading = false
          state.clients = action.payload.clients
          state.trainers = action.payload.trainers
          state.masseurs = action.payload.masseurs
          state.managers = action.payload.managers
        },
      )
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch users"
      })
      .addCase(updateUserAsync.fulfilled, (state, action: PayloadAction<User>) => {
        const user = action.payload
        const categories = ["clients", "trainers", "masseurs", "managers"] as const

        for (const category of categories) {
          const index = state[category].findIndex((u) => u.id === user.id)
          if (index !== -1) {
            state[category][index] = user
            break
          }
        }
      })
      .addCase(blockUserAsync.fulfilled, (state, action: PayloadAction<User>) => {
        const user = action.payload
        const categories = ["clients", "trainers", "masseurs", "managers"] as const

        for (const category of categories) {
          const index = state[category].findIndex((u) => u.id === user.id)
          if (index !== -1) {
            state[category][index] = user
            break
          }
        }
      })
      .addCase(unblockUserAsync.fulfilled, (state, action: PayloadAction<User>) => {
        const user = action.payload
        const categories = ["clients", "trainers", "masseurs", "managers"] as const

        for (const category of categories) {
          const index = state[category].findIndex((u) => u.id === user.id)
          if (index !== -1) {
            state[category][index] = user
            break
          }
        }
      })
  },
})

export default userSlice.reducer
