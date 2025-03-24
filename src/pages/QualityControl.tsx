
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Check } from "lucide-react";

const QualityControl: React.FC = () => {
  return (
    <Layout>
      <PageHeader
        title="Quality Control"
        description="Manage quality checks and service standards."
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard title="Quality Metrics">
          <div className="p-4 text-center bg-muted/30 rounded-md h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Check className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Quality metrics charts will be displayed here</p>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Recent Inspections">
          <div className="p-4 text-center bg-muted/30 rounded-md h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Check className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Recent inspections list will be displayed here</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </Layout>
  );
};

export default QualityControl;
