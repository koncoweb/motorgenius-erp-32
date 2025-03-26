
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { AnalyticsMetric } from "@/services/analyticsService";

interface WorkOrderAnalysisChartProps {
  data: AnalyticsMetric[];
  isLoading?: boolean;
}

export function WorkOrderAnalysisChart({ data, isLoading = false }: WorkOrderAnalysisChartProps) {
  const chartData = React.useMemo(() => {
    // Filter data untuk kategori 'performance' saja
    return data
      .filter(item => item.metric_category === 'performance')
      .map((item) => ({
        name: item.metric_name,
        value: parseFloat(item.metric_value.toString()),
      }));
  }, [data]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Work Order Analysis</CardTitle>
          <CardDescription>Breakdown of work order statuses</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading chart data...</div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Work Order Analysis</CardTitle>
          <CardDescription>Breakdown of work order statuses</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-muted-foreground">No work order data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Order Analysis</CardTitle>
        <CardDescription>Breakdown of work order statuses</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
