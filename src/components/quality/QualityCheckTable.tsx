
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Pencil, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QualityCheck } from "@/services/qualityService";
import { format } from "date-fns";

interface QualityCheckTableProps {
  qualityChecks: QualityCheck[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const QualityCheckTable: React.FC<QualityCheckTableProps> = ({
  qualityChecks,
  onView,
  onEdit,
  onDelete,
}) => {
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

  // Render star rating (1-5)
  const renderRating = (rating: number | null) => {
    if (!rating) return 'N/A';
    
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Work Order</TableHead>
          <TableHead>Inspector</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {qualityChecks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No quality checks found. Create your first quality check to get started.
            </TableCell>
          </TableRow>
        ) : (
          qualityChecks.map((check) => (
            <TableRow key={check.id}>
              <TableCell>{format(new Date(check.inspectionDate), 'MMM d, yyyy')}</TableCell>
              <TableCell>{check.workOrderNumber || 'N/A'}</TableCell>
              <TableCell>{check.inspector}</TableCell>
              <TableCell>{renderStatusBadge(check.status)}</TableCell>
              <TableCell className="text-amber-500">{renderRating(check.rating)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(check.id)} title="View details">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(check.id)} title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(check.id)} title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
