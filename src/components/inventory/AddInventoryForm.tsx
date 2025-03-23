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

// Schema validasi form
const formSchema = z.object({
  sku: z.string().min(3, "SKU harus minimal 3 karakter"),
  name: z.string().min(3, "Nama harus minimal 3 karakter"),
  category: z.string().min(1, "Kategori harus dipilih"),
  currentStock: z.coerce.number().int().min(0, "Stok tidak boleh negatif"),
  minStock: z.coerce.number().int().min(0, "Stok minimal tidak boleh negatif"),
  location: z.string().min(1, "Lokasi harus diisi"),
  unitPrice: z.coerce.number().min(0, "Harga tidak boleh negatif"),
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
      // Fix: Ensure all required properties are included and are non-optional
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
        toast.success(`Item ${values.name} berhasil ditambahkan`);
        // Invalidate queries untuk memperbarui data
        queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
        // Reset form dan tutup dialog
        form.reset();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Gagal menambahkan item");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Item Inventaris Baru</DialogTitle>
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
                    <FormLabel>Nama Item</FormLabel>
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
                    <FormLabel>Kategori</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
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
                    <FormLabel>Lokasi</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih lokasi" />
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
                    <FormLabel>Stok Saat Ini</FormLabel>
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
                    <FormLabel>Stok Minimal</FormLabel>
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
                    <FormLabel>Harga Satuan</FormLabel>
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
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
