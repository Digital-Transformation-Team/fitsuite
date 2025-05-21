import type { StatItem } from "@/components/analytics/stat-summary"

export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: any
}

export interface AttendanceAnalytics {
  stats: StatItem[]
  byDay: ChartDataPoint[]
  byHour: ChartDataPoint[]
  byFacility: ChartDataPoint[]
}

export interface SalesAnalytics {
  stats: StatItem[]
  byProduct: ChartDataPoint[]
  trend: ChartDataPoint[]
  byMembershipType: ChartDataPoint[]
}

export interface ClientAnalytics {
  stats: StatItem[]
  ageDistribution: ChartDataPoint[]
  activityLevel: ChartDataPoint[]
  retention: ChartDataPoint[]
}

export interface TrainerAnalytics {
  stats: StatItem[]
  sessions: ChartDataPoint[]
  ratings: ChartDataPoint[]
  retention: ChartDataPoint[]
}

export interface FinancialAnalytics {
  stats: StatItem[]
  revenueVsExpense: ChartDataPoint[]
  revenueBySource: ChartDataPoint[]
  expenseByType: ChartDataPoint[]
}

export interface AnalyticsData {
  attendance: AttendanceAnalytics
  sales: SalesAnalytics
  clients: ClientAnalytics
  trainers: TrainerAnalytics
  financial: FinancialAnalytics
}
