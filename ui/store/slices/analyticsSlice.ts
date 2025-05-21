import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { fetchAnalyticsData } from "@/api/analyticsService"
import type { DateRange } from "react-day-picker"
import type {
  AnalyticsData,
  AttendanceAnalytics,
  SalesAnalytics,
  ClientAnalytics,
  TrainerAnalytics,
  FinancialAnalytics,
} from "@/types/analytics"

interface AnalyticsState {
  attendance: AttendanceAnalytics
  sales: SalesAnalytics
  clients: ClientAnalytics
  trainers: TrainerAnalytics
  financial: FinancialAnalytics
  dateRange: DateRange | undefined
  loading: boolean
  error: string | null
}

const initialState: AnalyticsState = {
  attendance: {
    stats: [],
    byDay: [],
    byHour: [],
    byFacility: [],
  },
  sales: {
    stats: [],
    byProduct: [],
    trend: [],
    byMembershipType: [],
  },
  clients: {
    stats: [],
    ageDistribution: [],
    activityLevel: [],
    retention: [],
  },
  trainers: {
    stats: [],
    sessions: [],
    ratings: [],
    retention: [],
  },
  financial: {
    stats: [],
    revenueVsExpense: [],
    revenueBySource: [],
    expenseByType: [],
  },
  dateRange: undefined,
  loading: false,
  error: null,
}

export const fetchAnalyticsDataAsync = createAsyncThunk(
  "analytics/fetchAnalyticsData",
  async (dateRange: DateRange | undefined) => {
    return await fetchAnalyticsData(dateRange)
  },
)

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<DateRange | undefined>) => {
      state.dateRange = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsDataAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAnalyticsDataAsync.fulfilled, (state, action: PayloadAction<AnalyticsData>) => {
        state.loading = false
        state.attendance = action.payload.attendance
        state.sales = action.payload.sales
        state.clients = action.payload.clients
        state.trainers = action.payload.trainers
        state.financial = action.payload.financial
      })
      .addCase(fetchAnalyticsDataAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch analytics data"
      })
  },
})

export const { setDateRange } = analyticsSlice.actions
export default analyticsSlice.reducer
