import { configureStore } from "@reduxjs/toolkit"
import securityReducer from "./slices/securitySlice"
import userReducer from "./slices/userSlice"
import bookingReducer from "./slices/bookingSlice"
import membershipReducer from "./slices/membershipSlice"
import analyticsReducer from "./slices/analyticsSlice"

export const store = configureStore({
  reducer: {
    security: securityReducer,
    users: userReducer,
    bookings: bookingReducer,
    memberships: membershipReducer,
    analytics: analyticsReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
