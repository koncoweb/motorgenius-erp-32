
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchAnalyticsMetrics, AnalyticsMetric } from "@/services/analyticsService";
import { PerformanceChart } from "@/components/analytics/PerformanceChart";
import { WorkOrderAnalysisChart } from "@/components/analytics/WorkOrderAnalysisChart";
import { MetricsCards } from "@/components/analytics/MetricsCards";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Analytics: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAnalyticsMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error loading analytics metrics:', error);
        toast({
          variant: "destructive",
          title: "Error loading analytics",
          description: "There was a problem loading the analytics data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [toast]);

  return (
    <Layout>
      <PageHeader
        title="Analytics"
        description="Business intelligence and performance metrics."
      />
      
      <div className="space-y-6">
        <MetricsCards data={metrics} />
        
        <Separator className="my-6" />
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workorders">Work Orders</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <PerformanceChart data={metrics} isLoading={isLoading} />
              <WorkOrderAnalysisChart data={metrics} isLoading={isLoading} />
            </div>
            
            <DashboardCard title="Key Insights">
              <div className="p-4">
                <ul className="space-y-2 list-disc pl-5">
                  <li>Work order completion rate has increased by 5% this month</li>
                  <li>Quality control pass rate is at 85%, above the target of 80%</li>
                  <li>Low stock alerts have decreased by 15% since last inventory update</li>
                  <li>Monthly revenue is tracking 12% higher than previous month</li>
                </ul>
              </div>
            </DashboardCard>
          </TabsContent>
          
          <TabsContent value="workorders">
            <DashboardCard title="Work Order Analytics">
              <div className="p-4">
                <p className="text-muted-foreground mb-4">Detailed work order performance analytics and trends.</p>
                <WorkOrderAnalysisChart 
                  data={metrics.filter(m => m.metric_category === 'performance')} 
                  isLoading={isLoading} 
                />
              </div>
            </DashboardCard>
          </TabsContent>
          
          <TabsContent value="quality">
            <DashboardCard title="Quality Control Analytics">
              <div className="p-4">
                <p className="text-muted-foreground mb-4">Quality control metrics and improvement opportunities.</p>
                <PerformanceChart 
                  data={metrics.filter(m => m.metric_category === 'quality')} 
                  isLoading={isLoading} 
                />
              </div>
            </DashboardCard>
          </TabsContent>
          
          <TabsContent value="finance">
            <DashboardCard title="Financial Analytics">
              <div className="p-4">
                <p className="text-muted-foreground mb-4">Financial performance metrics and revenue analysis.</p>
                <PerformanceChart 
                  data={metrics.filter(m => m.metric_category === 'finance')} 
                  isLoading={isLoading} 
                />
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics;
