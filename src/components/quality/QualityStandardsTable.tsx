
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { QualityStandard } from "@/services/qualityService";

interface QualityStandardsTableProps {
  standards: QualityStandard[];
}

export const QualityStandardsTable: React.FC<QualityStandardsTableProps> = ({
  standards
}) => {
  // Group standards by category
  const standardsByCategory: { [key: string]: QualityStandard[] } = {};
  
  standards.forEach(standard => {
    if (!standardsByCategory[standard.category]) {
      standardsByCategory[standard.category] = [];
    }
    standardsByCategory[standard.category].push(standard);
  });

  return (
    <div className="space-y-6">
      {Object.entries(standardsByCategory).map(([category, categoryStandards]) => (
        <div key={category} className="border rounded-md">
          <div className="bg-muted/50 px-4 py-2 border-b">
            <h3 className="text-lg font-medium">{category}</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Standard</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryStandards.map((standard) => (
                <TableRow key={standard.id}>
                  <TableCell className="font-medium">{standard.name}</TableCell>
                  <TableCell>{standard.description || "No description available"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
      
      {standards.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          No quality standards found.
        </div>
      )}
    </div>
  );
};
