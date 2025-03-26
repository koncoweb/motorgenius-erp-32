
import React from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WorkOrderQualityChipProps {
  workOrderId: string | number;
  status?: 'passed' | 'failed' | 'pending';
}

export const WorkOrderQualityChip: React.FC<WorkOrderQualityChipProps> = ({
  workOrderId,
  status
}) => {
  // Color mapping based on status
  const colorMap = {
    passed: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    failed: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
    none: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
  };

  // Get color based on status
  const color = status ? colorMap[status] : colorMap.none;
  
  // Label text based on status
  const label = status 
    ? `Quality: ${status.charAt(0).toUpperCase() + status.slice(1)}` 
    : "Add Quality Check";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={`/quality?workOrderId=${workOrderId}`}>
            <Badge 
              variant="outline" 
              className={`cursor-pointer ${color}`}
            >
              <ClipboardCheck className="h-3.5 w-3.5 mr-1" />
              {label}
            </Badge>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          {status 
            ? `View quality check details for work order ${workOrderId}`
            : `Create a new quality check for work order ${workOrderId}`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
