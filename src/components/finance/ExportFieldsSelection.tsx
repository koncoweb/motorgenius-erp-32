
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExportFields } from "@/hooks/useFinanceExport";

interface ExportFieldsSelectionProps {
  includeFields: ExportFields;
  onToggleField: (field: keyof ExportFields) => void;
}

export function ExportFieldsSelection({
  includeFields,
  onToggleField
}: ExportFieldsSelectionProps) {
  return (
    <div className="space-y-2">
      <Label>Fields to Include</Label>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="field-id" 
            checked={includeFields.id}
            onCheckedChange={() => onToggleField("id")}
          />
          <Label htmlFor="field-id">ID</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="field-type" 
            checked={includeFields.type}
            onCheckedChange={() => onToggleField("type")}
          />
          <Label htmlFor="field-type">Type</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="field-amount" 
            checked={includeFields.amount}
            onCheckedChange={() => onToggleField("amount")}
          />
          <Label htmlFor="field-amount">Amount</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="field-description" 
            checked={includeFields.description}
            onCheckedChange={() => onToggleField("description")}
          />
          <Label htmlFor="field-description">Description</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="field-category" 
            checked={includeFields.category}
            onCheckedChange={() => onToggleField("category")}
          />
          <Label htmlFor="field-category">Category</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="field-date" 
            checked={includeFields.date}
            onCheckedChange={() => onToggleField("date")}
          />
          <Label htmlFor="field-date">Date</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="field-related-work-order" 
            checked={includeFields.related_work_order_id}
            onCheckedChange={() => onToggleField("related_work_order_id")}
          />
          <Label htmlFor="field-related-work-order">Related Work Order</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="field-created-at" 
            checked={includeFields.created_at}
            onCheckedChange={() => onToggleField("created_at")}
          />
          <Label htmlFor="field-created-at">Created At</Label>
        </div>
      </div>
    </div>
  );
}
