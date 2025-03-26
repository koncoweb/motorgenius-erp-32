
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Filter, ClipboardCheck } from "lucide-react";
import { QualityCheckTable } from "@/components/quality/QualityCheckTable";
import { AddQualityCheckForm } from "@/components/quality/AddQualityCheckForm";
import { QualityMetricsCard } from "@/components/quality/QualityMetricsCard";
import { QualityStandardsTable } from "@/components/quality/QualityStandardsTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  QualityCheck, 
  deleteQualityCheck, 
  fetchQualityChecks, 
  fetchQualityStandards, 
  fetchQualityCheckById
} from "@/services/qualityService";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QualityCheckDetailDialog } from "@/components/quality/QualityCheckDetailDialog";

const QualityControl: React.FC = () => {
  // Query client for refetching data
  const queryClient = useQueryClient();
  
  // State for managing UI
  const [activeTab, setActiveTab] = useState("checks");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewingCheckId, setViewingCheckId] = useState<string | null>(null);
  const [editingCheckId, setEditingCheckId] = useState<string | null>(null);
  
  // Fetch quality checks
  const { data: qualityChecks = [], isLoading: isLoadingChecks } = useQuery({
    queryKey: ['qualityChecks'],
    queryFn: fetchQualityChecks,
  });
  
  // Fetch the specific quality check when viewingCheckId changes
  const { data: viewingCheck, isLoading: isLoadingViewCheck } = useQuery({
    queryKey: ['qualityCheck', viewingCheckId],
    queryFn: () => viewingCheckId ? fetchQualityCheckById(viewingCheckId) : null,
    enabled: !!viewingCheckId,
  });
  
  // Fetch quality standards
  const { data: qualityStandards = [], isLoading: isLoadingStandards } = useQuery({
    queryKey: ['qualityStandards'],
    queryFn: fetchQualityStandards,
  });
  
  // Filtered quality checks
  const [filteredChecks, setFilteredChecks] = useState<QualityCheck[]>([]);
  
  // Filter quality checks
  React.useEffect(() => {
    let filtered = [...qualityChecks];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(check => check.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        check =>
          check.inspector.toLowerCase().includes(query) ||
          (check.workOrderNumber && check.workOrderNumber.toLowerCase().includes(query)) ||
          (check.notes && check.notes.toLowerCase().includes(query))
      );
    }
    
    setFilteredChecks(filtered);
  }, [qualityChecks, searchQuery, statusFilter]);
  
  // Handlers
  const handleCreateQualityCheck = () => {
    setIsCreateDialogOpen(true);
  };
  
  const handleViewQualityCheck = (id: string) => {
    setViewingCheckId(id);
  };
  
  const handleCloseViewDialog = () => {
    setViewingCheckId(null);
  };
  
  const handleEditQualityCheck = (id: string) => {
    setEditingCheckId(id);
    setIsCreateDialogOpen(true);
  };
  
  const handleDeleteQualityCheck = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this quality check?");
    
    if (confirmed) {
      const success = await deleteQualityCheck(id);
      
      if (success) {
        toast.success("Quality check deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['qualityChecks'] });
      } else {
        toast.error("Failed to delete quality check");
      }
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Quality Control"
        description="Manage quality checks and service standards."
        actionLabel="New Quality Check"
        actionIcon={<Plus size={16} />}
        onAction={handleCreateQualityCheck}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="checks">Quality Checks</TabsTrigger>
          <TabsTrigger value="standards">Quality Standards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="checks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
                <div className="w-full md:w-64">
                  <Label htmlFor="search-quality-checks" className="text-sm">Search</Label>
                  <Input
                    id="search-quality-checks"
                    placeholder="Search quality checks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="w-full md:w-40">
                  <Label htmlFor="status-filter" className="text-sm">Status</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger id="status-filter" className="w-full">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  className="md:ml-auto"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                >
                  <Filter size={16} className="mr-2" />
                  Reset Filters
                </Button>
              </div>
              
              <div className="rounded-md border">
                {isLoadingChecks ? (
                  <div className="flex justify-center p-8">
                    <p>Loading quality checks...</p>
                  </div>
                ) : (
                  <QualityCheckTable 
                    qualityChecks={filteredChecks} 
                    onView={handleViewQualityCheck}
                    onEdit={handleEditQualityCheck}
                    onDelete={handleDeleteQualityCheck}
                  />
                )}
              </div>
            </div>
            
            <div className="md:col-span-1">
              <QualityMetricsCard qualityChecks={qualityChecks} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="standards">
          <DashboardCard title="Quality Standards">
            {isLoadingStandards ? (
              <div className="flex justify-center p-8">
                <p>Loading quality standards...</p>
              </div>
            ) : (
              <QualityStandardsTable standards={qualityStandards} />
            )}
          </DashboardCard>
        </TabsContent>
      </Tabs>
      
      <AddQualityCheckForm 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        qualityCheckId={editingCheckId}
        onSuccess={() => setEditingCheckId(null)}
      />

      {viewingCheckId && (
        <QualityCheckDetailDialog
          open={!!viewingCheckId}
          onOpenChange={handleCloseViewDialog}
          qualityCheck={viewingCheck}
          isLoading={isLoadingViewCheck}
        />
      )}
    </Layout>
  );
};

export default QualityControl;
