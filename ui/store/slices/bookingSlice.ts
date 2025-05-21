import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { fetchBookings, fetchResources, createBooking, updateBooking, cancelBooking } from "@/api/bookingService"
import type { Booking, Court, Trainer, Masseur } from "@/types/booking"

interface BookingState {
  bookings: Booking[]
  trainers: Trainer[]
  masseurs: Masseur[]
  courts: Court[]
  loading: boolean
  error: string | null
}

const initialState: BookingState = {
  bookings: [],
  trainers: [],
  masseurs: [],
  courts: [],
  loading: false,
  error: null,
}

export const fetchBookingsAsync = createAsyncThunk("bookings/fetchBookings", async () => {
  return await fetchBookings()
})

export const fetchResourcesAsync = createAsyncThunk("bookings/fetchResources", async () => {
  return await fetchResources()
})

export const createBookingAsync = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData: Omit<Booking, "id">) => {
    return await createBooking(bookingData)
  },
)

export const updateBookingAsync = createAsyncThunk(
  "bookings/updateBooking",
  async ({ id, bookingData }: { id: string; bookingData: Partial<Booking> }) => {
    return await updateBooking(id, bookingData)
  },
)

export const cancelBookingAsync = createAsyncThunk("bookings/cancelBooking", async (id: string) => {
  return await cancelBooking(id)
})

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookingsAsync.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.loading = false
        state.bookings = action.payload
      })
      .addCase(fetchBookingsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch bookings"
      })
      .addCase(
        fetchResourcesAsync.fulfilled,
        (
          state,
          action: PayloadAction<{
            trainers: Trainer[]
            masseurs: Masseur[]
            courts: Court[]
          }>,
        ) => {
          state.trainers = action.payload.trainers
          state.masseurs = action.payload.masseurs
          state.courts = action.payload.courts
        },
      )
      .addCase(createBookingAsync.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.bookings.push(action.payload)
      })
      .addCase(updateBookingAsync.fulfilled, (state, action: PayloadAction<Booking>) => {
        const index = state.bookings.findIndex((booking) => booking.id === action.payload.id)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
      })
      .addCase(cancelBookingAsync.fulfilled, (state, action: PayloadAction<Booking>) => {
        const index = state.bookings.findIndex((booking) => booking.id === action.payload.id)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
      })
  },
})

export default bookingSlice.reducer
