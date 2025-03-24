
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Calendar, Clock } from "lucide-react";

const Scheduling: React.FC = () => {
  return (
    <Layout>
      <PageHeader
        title="Scheduling"
        description="Manage and schedule work orders and team assignments."
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard title="Upcoming Appointments">
          <div className="p-4 text-center bg-muted/30 rounded-md h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Calendar className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Calendar view will be implemented here</p>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Team Availability">
          <div className="p-4 text-center bg-muted/30 rounded-md h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Clock className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Team availability will be displayed here</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </Layout>
  );
};

export default Scheduling;
