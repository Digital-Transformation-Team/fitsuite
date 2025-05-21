"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DateRange } from "react-day-picker"
import { subDays } from "date-fns"

import { ChartCard } from "@/components/memberships/chart-card"
import { ExportButton, type ExportFormat } from "@/components/analytics/export-button"
import { StatSummary, type StatItem } from "@/components/analytics/stat-summary"
import { DateRangePicker } from "@/components/analytics/date-range-picker"

// Sample data for charts
const attendanceByDayData = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 145 },
  { name: "Wed", value: 135 },
  { name: "Thu", value: 160 },
  { name: "Fri", value: 180 },
  { name: "Sat", value: 210 },
  { name: "Sun", value: 130 },
]

const attendanceByHourData = [
  { name: "6am", value: 25 },
  { name: "8am", value: 85 },
  { name: "10am", value: 132 },
  { name: "12pm", value: 175 },
  { name: "2pm", value: 120 },
  { name: "4pm", value: 165 },
  { name: "6pm", value: 190 },
  { name: "8pm", value: 110 },
  { name: "10pm", value: 45 },
]

const attendanceByFacilityData = [
  { name: "Gym", value: 450 },
  { name: "Pool", value: 280 },
  { name: "Tennis", value: 150 },
  { name: "Classes", value: 320 },
  { name: "Yoga", value: 180 },
]

const salesByProductData = [
  { name: "Memberships", value: 65000 },
  { name: "Personal Training", value: 45000 },
  { name: "Classes", value: 28000 },
  { name: "Merchandise", value: 12000 },
  { name: "Supplements", value: 8000 },
]

const salesTrendData = [
  { name: "Jan", value: 42000 },
  { name: "Feb", value: 45000 },
  { name: "Mar", value: 48000 },
  { name: "Apr", value: 52000 },
  { name: "May", value: 58000 },
  { name: "Jun", value: 62000 },
]

const membershipSalesData = [
  { name: "Basic", value: 120 },
  { name: "Standard", value: 180 },
  { name: "Premium", value: 85 },
  { name: "Family", value: 45 },
  { name: "Corporate", value: 30 },
]

const clientAgeDistributionData = [
  { name: "18-24", value: 120 },
  { name: "25-34", value: 220 },
  { name: "35-44", value: 180 },
  { name: "45-54", value: 140 },
  { name: "55-64", value: 80 },
  { name: "65+", value: 40 },
]

const clientActivityLevelData = [
  { name: "Very Active", value: 180 },
  { name: "Active", value: 280 },
  { name: "Moderate", value: 220 },
  { name: "Light", value: 120 },
  { name: "Inactive", value: 80 },
]

const clientRetentionData = [
  { name: "0-3 months", value: 85 },
  { name: "3-6 months", value: 75 },
  { name: "6-12 months", value: 65 },
  { name: "1-2 years", value: 55 },
  { name: "2+ years", value: 45 },
]

const trainerSessionsData = [
  { name: "John", value: 85 },
  { name: "Sarah", value: 92 },
  { name: "Mike", value: 78 },
  { name: "Emily", value: 88 },
  { name: "David", value: 72 },
]

const trainerRatingsData = [
  { name: "John", value: 4.7 },
  { name: "Sarah", value: 4.9 },
  { name: "Mike", value: 4.5 },
  { name: "Emily", value: 4.8 },
  { name: "David", value: 4.6 },
]

const trainerClientRetentionData = [
  { name: "John", value: 82 },
  { name: "Sarah", value: 88 },
  { name: "Mike", value: 75 },
  { name: "Emily", value: 85 },
  { name: "David", value: 78 },
]

const revenueExpenseData = [
  { name: "Jan", revenue: 85000, expense: 65000 },
  { name: "Feb", revenue: 88000, expense: 66000 },
  { name: "Mar", revenue: 92000, expense: 68000 },
  { name: "Apr", revenue: 96000, expense: 70000 },
  { name: "May", revenue: 102000, expense: 72000 },
  { name: "Jun", revenue: 108000, expense: 75000 },
]

const revenueBySourceData = [
  { name: "Memberships", value: 65 },
  { name: "Personal Training", value: 20 },
  { name: "Classes", value: 8 },
  { name: "Merchandise", value: 5 },
  { name: "Other", value: 2 },
]

const expenseByTypeData = [
  { name: "Staff", value: 45 },
  { name: "Facilities", value: 25 },
  { name: "Equipment", value: 15 },
  { name: "Marketing", value: 10 },
  { name: "Other", value: 5 },
]

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("attendance")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  // Handle export for different formats
  const handleExport = async (format: ExportFormat) => {
    // Simulate export delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log(`Exporting ${activeTab} data as ${format}...`)
    // In a real app, you would implement actual export functionality here
  }

  // Stat summaries for each tab
  const attendanceStats: StatItem[] = [
    {
      label: "Total Visits",
      value: "1,245",
      change: 8.2,
      trend: "up",
      changeLabel: "vs last period",
    },
    {
      label: "Average Daily",
      value: "156",
      change: 5.4,
      trend: "up",
      changeLabel: "vs last period",
    },
    {
      label: "Peak Hour",
      value: "6:00 PM",
      changeLabel: "190 visits",
    },
    {
      label: "Most Popular",
      value: "Gym",
      changeLabel: "450 visits",
    },
  ]

  const salesStats: StatItem[] = [
    {
      label: "Total Revenue",
      value: "$158,000",
      change: 12.5,
      trend: "up",
      changeLabel: "vs last period",
    },
    {
      label: "New Memberships",
      value: "85",
      change: 7.2,
      trend: "up",
      changeLabel: "vs last period",
    },
    {
      label: "Avg. Transaction",
      value: "$245",
      change: 3.1,
      trend: "up",
      changeLabel: "vs last period",
    },
    {
      label: "Conversion Rate",
      value: "28%",
      change: 1.5,
      trend: "up",
      changeLabel: "vs last period",
    },
  ]

  const clientStats: StatItem[] = [
    {
      label: "Total Clients",
      value: "1,850",
      change: 5.2,
      trend: "up",
      changeLabel: "vs last period",
    },
    {
      label: "New Clients",
      value: "124",
      change: 8.7,
      trend: "up",
      changeLabel: "vs last period",
    },
    {
      label: "Retention Rate",
      value: "78%",
      change: 2.1,
      trend: "up",
      changeLabel: "vs last period",
    },
    {
      label: "Avg. Lifetime Value",
      value: "$2,450",
      change: 4.3,
      trend: "up",
      changeLabel: "vs last period",
    },
  ]

  const trainerStats: StatItem[] = [
    {
      label: "Total Trainers",
      value: "24",
      change: 0,
      trend: "neutral",
      changeLabel: "vs last period",
    },
    {
      label: "Sessions Completed",
      value: "845",
      change: 6.8,
      trend: "up",
      changeLabel: "vs last period",
    },
    {
      label: "Avg. Rating",
      value: "4.7",
      change: 0.2,
      trend: "up",
      changeLabel: "vs last period",
    },
    {
      label: "Client Retention",
      value: "82%",
      change: 3.5,
      trend: "up",
      changeLabel: "vs last period",
    },
  ]

  const financialStats: StatItem[] = [
    {
      label: "Total Revenue",
      value: "$571,000",
      change: 12.5,
      trend: "up",
      changeLabel: "vs last period",
    },
    {
      label: "Total Expenses",
      value: "$416,000",
      change: 8.2,
      trend: "up",
      changeLabel: "vs last period",
    },
    {
      label: "Net Profit",
      value: "$155,000",
      change: 15.3,
      trend: "up",
      changeLabel: "vs last period",
    },
    {
      label: "Profit Margin",
      value: "27.1%",
      change: 2.4,
      trend: "up",
      changeLabel: "vs last period",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <div className="flex items-center gap-2">
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            <ExportButton onExport={handleExport} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="clients">Client Segments</TabsTrigger>
            <TabsTrigger value="trainers">Trainer Performance</TabsTrigger>
            <TabsTrigger value="financial">Financial Overview</TabsTrigger>
          </TabsList>

          {/* Attendance Analytics Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <StatSummary stats={attendanceStats} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard
                title="Attendance by Day of Week"
                description="Average daily attendance over the selected period"
                chart="bar"
                data={attendanceByDayData}
                index="name"
                categories={["value"]}
                colors={["#2563eb"]}
              />
              <ChartCard
                title="Attendance by Hour"
                description="Average hourly attendance over the selected period"
                chart="line"
                data={attendanceByHourData}
                index="name"
                categories={["value"]}
                colors={["#16a34a"]}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Attendance by Facility</CardTitle>
                <CardDescription>Total visits by facility type over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartCard
                  title=""
                  chart="bar"
                  data={attendanceByFacilityData}
                  index="name"
                  categories={["value"]}
                  colors={["#8b5cf6"]}
                  className="mt-0"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Analytics Tab */}
          <TabsContent value="sales" className="space-y-6">
            <StatSummary stats={salesStats} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard
                title="Sales by Product Category"
                description="Revenue breakdown by product category"
                chart="bar"
                data={salesByProductData}
                index="name"
                categories={["value"]}
                colors={["#f59e0b"]}
              />
              <ChartCard
                title="Sales Trend"
                description="Monthly sales trend over the past 6 months"
                chart="line"
                data={salesTrendData}
                index="name"
                categories={["value"]}
                colors={["#2563eb"]}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Membership Sales by Type</CardTitle>
                <CardDescription>Number of memberships sold by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartCard
                  title=""
                  chart="bar"
                  data={membershipSalesData}
                  index="name"
                  categories={["value"]}
                  colors={["#8b5cf6"]}
                  className="mt-0"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Segments Tab */}
          <TabsContent value="clients" className="space-y-6">
            <StatSummary stats={clientStats} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard
                title="Client Age Distribution"
                description="Breakdown of clients by age group"
                chart="bar"
                data={clientAgeDistributionData}
                index="name"
                categories={["value"]}
                colors={["#2563eb"]}
              />
              <ChartCard
                title="Client Activity Level"
                description="Clients categorized by activity frequency"
                chart="bar"
                data={clientActivityLevelData}
                index="name"
                categories={["value"]}
                colors={["#16a34a"]}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Client Retention by Tenure</CardTitle>
                <CardDescription>Percentage of clients retained by membership duration</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartCard
                  title=""
                  chart="line"
                  data={clientRetentionData}
                  index="name"
                  categories={["value"]}
                  colors={["#8b5cf6"]}
                  className="mt-0"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trainer Performance Tab */}
          <TabsContent value="trainers" className="space-y-6">
            <StatSummary stats={trainerStats} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard
                title="Sessions by Trainer"
                description="Number of sessions completed in the selected period"
                chart="bar"
                data={trainerSessionsData}
                index="name"
                categories={["value"]}
                colors={["#2563eb"]}
              />
              <ChartCard
                title="Trainer Ratings"
                description="Average client ratings (out of 5)"
                chart="bar"
                data={trainerRatingsData}
                index="name"
                categories={["value"]}
                colors={["#f59e0b"]}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Client Retention by Trainer</CardTitle>
                <CardDescription>Percentage of clients who continue training with each trainer</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartCard
                  title=""
                  chart="bar"
                  data={trainerClientRetentionData}
                  index="name"
                  categories={["value"]}
                  colors={["#8b5cf6"]}
                  className="mt-0"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Overview Tab */}
          <TabsContent value="financial" className="space-y-6">
            <StatSummary stats={financialStats} />

            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
                <CardDescription>Monthly comparison over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartCard
                  title=""
                  chart="bar"
                  data={revenueExpenseData}
                  index="name"
                  categories={["revenue", "expense"]}
                  colors={["#16a34a", "#ef4444"]}
                  className="mt-0"
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard
                title="Revenue by Source"
                description="Percentage breakdown of revenue sources"
                chart="area"
                data={revenueBySourceData}
                index="name"
                categories={["value"]}
                colors={["#2563eb"]}
              />
              <ChartCard
                title="Expenses by Type"
                description="Percentage breakdown of expense categories"
                chart="area"
                data={expenseByTypeData}
                index="name"
                categories={["value"]}
                colors={["#ef4444"]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
