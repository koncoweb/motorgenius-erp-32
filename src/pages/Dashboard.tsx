
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Briefcase, Users, Package, Clock, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from "recharts";

const salesData = [
  { name: "Jan", total: 4200 },
  { name: "Feb", total: 5800 },
  { name: "Mar", total: 7500 },
  { name: "Apr", total: 6800 },
  { name: "May", total: 9100 },
  { name: "Jun", total: 8600 },
  { name: "Jul", total: 10200 },
];

const workOrderData = [
  { name: "Repair", value: 42 },
  { name: "Reconditioning", value: 28 },
  { name: "Installation", value: 15 },
  { name: "Maintenance", value: 35 },
  { name: "Testing", value: 20 },
];

const recentActivities = [
  {
    id: "1",
    user: { name: "John Doe", initials: "JD" },
    action: "completed work order",
    target: "WO-2023-089",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    user: { name: "Alice Smith", initials: "AS" },
    action: "created a new customer",
    target: "Acme Industries",
    timestamp: "3 hours ago",
  },
  {
    id: "3",
    user: { name: "Bob Johnson", initials: "BJ" },
    action: "updated inventory item",
    target: "Electric Motor 15kW",
    timestamp: "5 hours ago",
  },
  {
    id: "4",
    user: { name: "Emma Wilson", initials: "EW" },
    action: "assigned work order",
    target: "WO-2023-092 to Mike T.",
    timestamp: "Yesterday at 4:30 PM",
  },
  {
    id: "5",
    user: { name: "Mike Thomas", initials: "MT" },
    action: "completed quality control for",
    target: "Generator Rebuild",
    timestamp: "Yesterday at 2:15 PM",
  },
  {
    id: "6",
    user: { name: "Sarah Parker", initials: "SP" },
    action: "created invoice",
    target: "INV-2023-156",
    timestamp: "2 days ago",
  },
];

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <PageHeader
        title="Dashboard"
        description="Welcome to MotorGenius ERP. Here's an overview of your business."
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Work Orders"
          value="28"
          description="7 pending approval"
          icon={<Briefcase className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Customers"
          value="142"
          description="18 new this month"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Inventory Items"
          value="568"
          description="12 low stock alerts"
          icon={<Package className="h-5 w-5" />}
          trend={{ value: 3, isPositive: false }}
        />
        <StatCard
          title="Scheduled Jobs"
          value="16"
          description="Next 7 days"
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
        />
      </div>
      
      <div className="grid gap-6 mt-6 md:grid-cols-7">
        <DashboardCard title="Revenue Overview" className="md:col-span-4">
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly" className="w-full">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickFormatter={(value) => `$${value}`} 
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, "Revenue"]} 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="monthly" className="w-full">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickFormatter={(value) => `$${value}`} 
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, "Revenue"]} 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="yearly" className="w-full">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickFormatter={(value) => `$${value}`} 
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, "Revenue"]} 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </DashboardCard>
        
        <ActivityFeed activities={recentActivities} className="md:col-span-3" />
      </div>
      
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <DashboardCard title="Work Order Types">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={workOrderData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }} 
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Count" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Financial Summary">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue (MTD)</p>
                <h4 className="text-2xl font-bold mt-1">$42,890</h4>
              </div>
              <div className="p-2 rounded-full bg-green-100 text-green-700">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outstanding Invoices</p>
                <h4 className="text-2xl font-bold mt-1">$12,450</h4>
              </div>
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-700">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Job Value</p>
                <h4 className="text-2xl font-bold mt-1">$3,245</h4>
              </div>
              <div className="p-2 rounded-full bg-blue-100 text-blue-700">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </Layout>
  );
};

export default Dashboard;
