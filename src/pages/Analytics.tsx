
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import {
  BarChart4,
  BarChart,
  Activity,
} from "lucide-react";

const Analytics: React.FC = () => {
  return (
    <Layout>
      <PageHeader
        title="Analytics"
        description="Business intelligence and performance metrics."
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard title="Performance Overview">
          <div className="p-4 text-center bg-muted/30 rounded-md h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Activity className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Performance charts will be displayed here</p>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Work Order Analysis">
          <div className="p-4 text-center bg-muted/30 rounded-md h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <BarChart className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Work order analysis will be displayed here</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </Layout>
  );
};

export default Analytics;
