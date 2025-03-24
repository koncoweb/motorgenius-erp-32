
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
import { addTeamMember } from "@/services/teamService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  role: z.string().min(1, "Role must be specified"),
  department: z.string().min(1, "Department must be specified"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number must be at least 5 characters"),
  status: z.enum(["available", "busy", "offsite", "leave"]),
});

type FormValues = z.infer<typeof formSchema>;

const departmentOptions = ["Motor Repair", "Generator Repair", "QA & Testing", "Design & Development"];
const roleOptions = ["Junior Technician", "Technician", "Senior Technician", "Electrical Engineer", "Lead Engineer"];

interface AddTeamMemberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTeamMemberForm: React.FC<AddTeamMemberFormProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      department: "",
      email: "",
      phone: "",
      status: "available",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const member = await addTeamMember({
        name: values.name,
        role: values.role,
        department: values.department,
        email: values.email,
        phone: values.phone,
        status: values.status
      });
      
      if (member) {
        toast.success(`Team member ${values.name} added successfully`);
        // Invalidate queries to update data
        queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
        // Reset form and close dialog
        form.reset();
        onOpenChange(false);
      } else {
        toast.error("Failed to add team member");
      }
    } catch (error) {
      toast.error("Failed to add team member");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Team Member</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
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
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departmentOptions.map((department) => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="offsite">Offsite</SelectItem>
                      <SelectItem value="leave">Leave</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Team Member</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
