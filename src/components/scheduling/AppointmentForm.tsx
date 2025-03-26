
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WorkOrder } from '@/services/workOrderService';
import { TeamMember } from '@/services/teamService';
import { ScheduleItem } from '@/services/schedulingService';
import { format, parseISO } from 'date-fns';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  appointment?: ScheduleItem;
  workOrders: WorkOrder[];
  teamMembers: TeamMember[];
  selectedDate: Date;
}

// Update the FormValues interface to match how we're actually using the data
interface FormValues {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  work_order_id: string; // Keep as string in the form
  team_member_id: string; // Keep as string in the form
  status: string;
  location: string;
  notes: string;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  appointment,
  workOrders,
  teamMembers,
  selectedDate,
}) => {
  const isEditing = !!appointment;
  
  const defaultStartTime = isEditing 
    ? format(parseISO(appointment.start_time), "yyyy-MM-dd'T'HH:mm")
    : format(selectedDate, "yyyy-MM-dd'T'09:00");
  
  const defaultEndTime = isEditing 
    ? format(parseISO(appointment.end_time), "yyyy-MM-dd'T'HH:mm")
    : format(selectedDate, "yyyy-MM-dd'T'10:00");

  const form = useForm<FormValues>({
    defaultValues: {
      title: appointment?.title || '',
      description: appointment?.description || '',
      start_time: defaultStartTime,
      end_time: defaultEndTime,
      work_order_id: appointment?.work_order_id?.toString() || '',
      team_member_id: appointment?.team_member_id?.toString() || '',
      status: appointment?.status || 'scheduled',
      location: appointment?.location || '',
      notes: appointment?.notes || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: appointment?.title || '',
        description: appointment?.description || '',
        start_time: defaultStartTime,
        end_time: defaultEndTime,
        work_order_id: appointment?.work_order_id?.toString() || '',
        team_member_id: appointment?.team_member_id?.toString() || '',
        status: appointment?.status || 'scheduled',
        location: appointment?.location || '',
        notes: appointment?.notes || '',
      });
    }
  }, [isOpen, appointment, form, defaultStartTime, defaultEndTime]);

  const handleSubmit = (values: FormValues) => {
    // Create a new object with the correct types
    const processedValues = {
      ...values,
      // Convert string IDs to numbers or null if empty
      work_order_id: values.work_order_id ? parseInt(values.work_order_id) : null,
      team_member_id: values.team_member_id ? parseInt(values.team_member_id) : null,
    };
    
    onSubmit(values); // Pass the original values (not processedValues) since onSubmit expects FormValues
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Appointment' : 'Add New Appointment'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Appointment title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the appointment"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="work_order_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Order</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a work order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null">None</SelectItem>
                      {workOrders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.workOrderNumber} - {order.customer}
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
              name="team_member_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign to team member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null">Unassigned</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.role})
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
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
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
                  <FormControl>
                    <Input placeholder="Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update' : 'Create'} Appointment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
