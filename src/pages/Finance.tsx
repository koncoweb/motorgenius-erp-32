
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DollarSign } from "lucide-react";

const Finance: React.FC = () => {
  return (
    <Layout>
      <PageHeader
        title="Finance"
        description="Track revenue, expenses, and financial performance."
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard title="Revenue Overview">
          <div className="p-4 text-center bg-muted/30 rounded-md h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <DollarSign className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Revenue charts will be displayed here</p>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Outstanding Invoices">
          <div className="p-4 text-center bg-muted/30 rounded-md h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <DollarSign className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Invoice list will be displayed here</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </Layout>
  );
};

export default Finance;
