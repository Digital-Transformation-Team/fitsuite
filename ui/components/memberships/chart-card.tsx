import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AreaChart, BarChart, LineChart } from "@/components/ui/chart";

interface ChartCardProps {
  title: string;
  description?: string;
  value?: string | number;
  chart: "line" | "bar" | "area";
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  className?: string;
}

export function ChartCard({
  title,
  description,
  value,
  chart,
  data,
  index,
  categories,
  colors = ["#2563eb"],
  className,
}: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {value && <div className="text-2xl font-bold">{value}</div>}
      </CardHeader>
      <CardContent>
        {/* {chart === "line" && (
          <LineChart
            data={data}
            index={index}
            categories={categories}
            colors={colors}
            className="aspect-[4/3]"
            showLegend={true}
          />
        )}
        {chart === "bar" && (
          <BarChart
            data={data}
            index={index}
            categories={categories}
            colors={colors}
            className="aspect-[4/3]"
            showLegend={true}
          />
        )}
        {chart === "area" && (
          <AreaChart
            data={data}
            index={index}
            categories={categories}
            colors={colors}
            className="aspect-[4/3]"
            showLegend={true}
          />
        )} */}
      </CardContent>
    </Card>
  );
}
