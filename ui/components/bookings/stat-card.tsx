"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, BarChart, LineChart } from "@/components/ui/chart"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  chart?: "line" | "bar" | "area"
  data: any[]
  category: string
  index: string
  colors?: string[]
}

export function StatCard({
  title,
  value,
  description,
  chart = "line",
  data,
  category,
  index,
  colors = ["#2563eb"],
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription className="text-2xl font-bold">{value}</CardDescription>
      </CardHeader>
      <CardContent>
        {description && <p className="text-xs text-muted-foreground mb-2">{description}</p>}
        {chart === "line" && (
          <LineChart
            data={data}
            index={index}
            categories={[category]}
            colors={colors}
            className="aspect-[4/3] w-full"
            showLegend={false}
            showXAxis={false}
            showYAxis={false}
            showGridLines={false}
          />
        )}
        {chart === "bar" && (
          <BarChart
            data={data}
            index={index}
            categories={[category]}
            colors={colors}
            className="aspect-[4/3] w-full"
            showLegend={false}
            showXAxis={false}
            showYAxis={false}
            showGridLines={false}
          />
        )}
        {chart === "area" && (
          <AreaChart
            data={data}
            index={index}
            categories={[category]}
            colors={colors}
            className="aspect-[4/3] w-full"
            showLegend={false}
            showXAxis={false}
            showYAxis={false}
            showGridLines={false}
          />
        )}
      </CardContent>
    </Card>
  )
}
