
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { QualityCheck, QualityCheckResult, QualityStandard, addQualityCheck, fetchQualityStandards } from "@/services/qualityService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchWorkOrders } from "@/services/workOrderService";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface AddQualityCheckFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddQualityCheckForm: React.FC<AddQualityCheckFormProps> = ({
  open,
  onOpenChange
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [standards, setStandards] = useState<QualityStandard[]>([]);
  const [standardResults, setStandardResults] = useState<{
    [key: string]: { passed: boolean; comments: string }
  }>({});
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<QualityCheck, 'id' | 'createdAt'>>();

  useEffect(() => {
    if (open) {
      // Fetch work orders
      fetchWorkOrders().then(data => setWorkOrders(data));
      
      // Fetch quality standards
      fetchQualityStandards().then(data => {
        setStandards(data);
        // Initialize the standard results object
        const initialResults: any = {};
        data.forEach(standard => {
          initialResults[standard.id] = { passed: false, comments: '' };
        });
        setStandardResults(initialResults);
      });
    }
  }, [open]);

  const onSubmit = async (data: Omit<QualityCheck, 'id' | 'createdAt'>) => {
    setLoading(true);
    
    try {
      // Convert the standard results to the format the API expects
      const checkResults: Omit<QualityCheckResult, 'id' | 'qualityCheckId'>[] = 
        Object.entries(standardResults).map(([standardId, result]) => ({
          standardId,
          passed: result.passed,
          comments: result.comments || null
        }));
      
      const result = await addQualityCheck(data, checkResults);
      
      if (result) {
        toast({
          title: "Quality check created",
          description: "The quality check has been created successfully.",
        });
        
        // Reset the form
        reset();
        // Reset the standard results
        const resetResults: any = {};
        standards.forEach(standard => {
          resetResults[standard.id] = { passed: false, comments: '' };
        });
        setStandardResults(resetResults);
        
        // Close the dialog
        onOpenChange(false);
        
        // Invalidate the quality checks query
        queryClient.invalidateQueries({ queryKey: ['qualityChecks'] });
      } else {
        toast({
          title: "Error",
          description: "There was an error creating the quality check.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating quality check:", error);
      toast({
        title: "Error",
        description: "There was an error creating the quality check.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStandardChange = (standardId: string, field: 'passed' | 'comments', value: boolean | string) => {
    setStandardResults(prev => ({
      ...prev,
      [standardId]: {
        ...prev[standardId],
        [field]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Quality Check</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inspectionDate">Inspection Date</Label>
              <Input
                id="inspectionDate"
                type="datetime-local"
                {...register("inspectionDate", { required: true })}
              />
              {errors.inspectionDate && (
                <p className="text-sm text-red-500">Inspection date is required</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workOrderId">Work Order (Optional)</Label>
              <Select onValueChange={(value) => register("workOrderId").onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select work order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  {workOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id.toString()}>
                      {order.workOrderNumber} - {order.customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspector">Inspector</Label>
            <Input
              id="inspector"
              placeholder="Inspector name"
              {...register("inspector", { required: true })}
            />
            {errors.inspector && (
              <p className="text-sm text-red-500">Inspector name is required</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                onValueChange={(value) => register("status").onChange({ target: { value } })}
                defaultValue="pending"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("status", { required: true })} defaultValue="pending" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Select onValueChange={(value) => register("rating").onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Fair</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              {...register("notes")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="actionItems">Action Items</Label>
            <Textarea
              id="actionItems"
              placeholder="Required actions..."
              {...register("actionItems")}
            />
          </div>
          
          <div className="space-y-4">
            <Label>Quality Standards</Label>
            
            {standards.map((standard) => (
              <div key={standard.id} className="border rounded-md p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Checkbox 
                    id={`standard-${standard.id}`}
                    checked={standardResults[standard.id]?.passed || false}
                    onCheckedChange={(checked) => 
                      handleStandardChange(standard.id, 'passed', checked as boolean)
                    }
                  />
                  <div>
                    <Label 
                      htmlFor={`standard-${standard.id}`}
                      className="font-medium"
                    >
                      {standard.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{standard.description}</p>
                    <Badge variant="outline" className="mt-1">
                      {standard.category}
                    </Badge>
                  </div>
                </div>
                
                <Textarea
                  placeholder="Comments..."
                  value={standardResults[standard.id]?.comments || ''}
                  onChange={(e) => 
                    handleStandardChange(standard.id, 'comments', e.target.value)
                  }
                  className="text-sm h-20"
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Quality Check"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
