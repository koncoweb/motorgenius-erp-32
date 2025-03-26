
import React from "react";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QualityCheck } from "@/services/qualityService";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface QualityCheckDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qualityCheck: QualityCheck | null | undefined;
  isLoading: boolean;
}

export function QualityCheckDetailDialog({
  open,
  onOpenChange,
  qualityCheck,
  isLoading
}: QualityCheckDetailDialogProps) {
  // Helper function to render rating stars
  const renderRating = (rating: number | null) => {
    if (!rating) return 'N/A';
    
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: QualityCheck['status']) => {
    switch (status) {
      case 'passed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Passed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Quality Check Details</DialogTitle>
          <DialogDescription>
            View detailed information about this quality check.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-20" />
          </div>
        ) : !qualityCheck ? (
          <div className="py-6 text-center text-muted-foreground">
            Quality check details could not be loaded.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">Inspection Date</h4>
                <p>{format(new Date(qualityCheck.inspectionDate), 'PPP')}</p>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">Status</h4>
                <div>{renderStatusBadge(qualityCheck.status)}</div>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">Inspector</h4>
                <p>{qualityCheck.inspector}</p>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">Rating</h4>
                <p className="text-amber-500">{renderRating(qualityCheck.rating)}</p>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">Work Order</h4>
                <p>{qualityCheck.workOrderNumber || 'N/A'}</p>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">Checklist Completed</h4>
                <p>{qualityCheck.checklistCompleted ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div>
              <h4 className="mb-1 text-sm font-medium text-muted-foreground">Notes</h4>
              <div className="p-3 rounded-md bg-muted min-h-[80px]">
                {qualityCheck.notes || 'No notes provided.'}
              </div>
            </div>

            {qualityCheck.issues && (
              <div>
                <h4 className="mb-1 text-sm font-medium text-muted-foreground">Issues Found</h4>
                <div className="p-3 rounded-md bg-muted min-h-[80px]">
                  {qualityCheck.issues}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
