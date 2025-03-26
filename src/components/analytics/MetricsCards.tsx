
import React from "react";
import { AnalyticsMetric } from "@/services/analyticsService";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  BarChart, 
  LineChart, 
  DollarSign, 
  ClipboardCheck 
} from "lucide-react";

interface MetricsCardsProps {
  data: AnalyticsMetric[];
}

export function MetricsCards({ data }: MetricsCardsProps) {
  // Fungsi untuk mendapatkan nilai metrik berdasarkan nama
  const getMetricValue = (name: string): number => {
    const metric = data.find(m => m.metric_name === name);
    return metric ? parseFloat(metric.metric_value.toString()) : 0;
  };

  // Dapatkan nilai metrik dari data
  const totalWorkOrders = getMetricValue('Total Work Orders');
  const completedWorkOrders = getMetricValue('Completed Work Orders');
  const qualityPassRate = getMetricValue('Quality Pass Rate');
  const monthlyRevenue = getMetricValue('Monthly Revenue');

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Work Orders" 
        value={totalWorkOrders}
        icon={<BarChart className="h-5 w-5" />}
        description="Total active work orders"
      />
      
      <StatCard 
        title="Completion Rate" 
        value={`${Math.round((completedWorkOrders / totalWorkOrders) * 100) || 0}%`}
        icon={<LineChart className="h-5 w-5" />}
        description="Work order completion rate"
        trend={{ value: 5, isPositive: true }}
      />
      
      <StatCard 
        title="Quality Pass Rate" 
        value={`${qualityPassRate}%`}
        icon={<ClipboardCheck className="h-5 w-5" />}
        description="Quality control pass rate"
        trend={{ value: 2, isPositive: true }}
      />
      
      <StatCard 
        title="Monthly Revenue" 
        value={`$${monthlyRevenue.toLocaleString()}`}
        icon={<DollarSign className="h-5 w-5" />}
        description="Total revenue this month"
        trend={{ value: 12, isPositive: true }}
      />
    </div>
  );
}
