
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addInventoryItem } from "@/services/inventoryService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Form validation schema
const formSchema = z.object({
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.string().min(1, "Category must be selected"),
  currentStock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  minStock: z.coerce.number().int().min(0, "Minimum stock cannot be negative"),
  location: z.string().min(1, "Location must be specified"),
  unitPrice: z.coerce.number().min(0, "Price cannot be negative"),
});

type FormValues = z.infer<typeof formSchema>;

const categoryOptions = ["Motors", "Parts", "Materials", "Generators", "Tools", "Other"];
const locationOptions = ["Warehouse A", "Warehouse B", "Warehouse C"];

interface AddInventoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddInventoryForm: React.FC<AddInventoryFormProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: "",
      name: "",
      category: "",
      currentStock: 0,
      minStock: 0,
      location: "",
      unitPrice: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Ensure all required properties are included and are non-optional
      const item = await addInventoryItem({
        sku: values.sku,
        name: values.name,
        category: values.category,
        currentStock: values.currentStock,
        minStock: values.minStock,
        location: values.location,
        unitPrice: values.unitPrice,
        lastRestocked: new Date().toISOString(),
      });
      
      if (item) {
        toast.success(`Item ${values.name} added successfully`);
        // Invalidate queries to update data
        queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
        // Reset form and close dialog
        form.reset();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Failed to add item");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="MTR-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Electric Motor 5kW" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locationOptions.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="currentStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
