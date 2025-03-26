
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Briefcase, Users, Package, Clock, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialSummaryCards } from "@/components/finance/FinancialSummaryCards";
import { formatRupiah } from "@/lib/utils";
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

// Updated data to use Rupiah
const salesData = [
  { name: "Jan", total: 42000000 },
  { name: "Feb", total: 58000000 },
  { name: "Mar", total: 75000000 },
  { name: "Apr", total: 68000000 },
  { name: "May", total: 91000000 },
  { name: "Jun", total: 86000000 },
  { name: "Jul", total: 102000000 },
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

// Mock financial summary data for the cards
const mockFinancialSummary = {
  month: new Date().toISOString(),
  total_revenue: 125000000,
  total_expenses: 78500000,
  net_income: 46500000
};

const Index: React.FC = () => {
  return (
    <Layout>
      <PageHeader
        title="Dashboard"
        description="Selamat datang di MotorGenius ERP. Berikut ringkasan bisnis Anda."
      />
      
      {/* Financial Summary Cards */}
      <div className="mb-6">
        <FinancialSummaryCards summary={mockFinancialSummary} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Work Orders"
          value="28"
          description="7 menunggu persetujuan"
          icon={<Briefcase className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Customers"
          value="142"
          description="18 baru bulan ini"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Inventory Items"
          value="568"
          description="12 stok rendah"
          icon={<Package className="h-5 w-5" />}
          trend={{ value: 3, isPositive: false }}
        />
        <StatCard
          title="Jadwal Pekerjaan"
          value="16"
          description="7 hari ke depan"
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
        />
      </div>
      
      <div className="grid gap-6 mt-6 md:grid-cols-7">
        <DashboardCard title="Revenue Overview" className="md:col-span-4 backdrop-blur-sm bg-card/50 border border-muted/30">
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="weekly">Mingguan</TabsTrigger>
              <TabsTrigger value="monthly">Bulanan</TabsTrigger>
              <TabsTrigger value="yearly">Tahunan</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly" className="w-full">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickFormatter={(value) => formatRupiah(value)} 
                    />
                    <Tooltip 
                      formatter={(value) => [formatRupiah(value as number), "Revenue"]} 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid hsl(var(--muted))', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'hsl(var(--card))'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: 'hsl(var(--primary))' }} 
                      activeDot={{ r: 6, stroke: 'hsl(var(--background))', strokeWidth: 2 }} 
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
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickFormatter={(value) => formatRupiah(value)} 
                    />
                    <Tooltip 
                      formatter={(value) => [formatRupiah(value as number), "Revenue"]} 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid hsl(var(--muted))', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'hsl(var(--card))'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: 'hsl(var(--primary))' }} 
                      activeDot={{ r: 6, stroke: 'hsl(var(--background))', strokeWidth: 2 }} 
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
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickFormatter={(value) => formatRupiah(value)} 
                    />
                    <Tooltip 
                      formatter={(value) => [formatRupiah(value as number), "Revenue"]} 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid hsl(var(--muted))', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'hsl(var(--card))'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: 'hsl(var(--primary))' }} 
                      activeDot={{ r: 6, stroke: 'hsl(var(--background))', strokeWidth: 2 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </DashboardCard>
        
        <ActivityFeed activities={recentActivities} className="md:col-span-3 backdrop-blur-sm bg-card/50 border border-muted/30" />
      </div>
      
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <DashboardCard title="Tipe Work Order" className="backdrop-blur-sm bg-card/50 border border-muted/30">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={workOrderData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid hsl(var(--muted))', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'hsl(var(--card))'
                  }} 
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Jumlah" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Ringkasan Keuangan" className="backdrop-blur-sm bg-card/50 border border-muted/30">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pendapatan (MTD)</p>
                <h4 className="text-2xl font-bold mt-1">{formatRupiah(42890000)}</h4>
              </div>
              <div className="p-2 rounded-full bg-green-100 text-green-700">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Faktur Tertunda</p>
                <h4 className="text-2xl font-bold mt-1">{formatRupiah(12450000)}</h4>
              </div>
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-700">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rata-rata Nilai Pekerjaan</p>
                <h4 className="text-2xl font-bold mt-1">{formatRupiah(3245000)}</h4>
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

export default Index;
