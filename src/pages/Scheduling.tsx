import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchedulingCalendar } from "@/components/scheduling/SchedulingCalendar";
import { AppointmentsList } from "@/components/scheduling/AppointmentsList";
import { AppointmentForm } from "@/components/scheduling/AppointmentForm";
import { TeamAvailability } from "@/components/scheduling/TeamAvailability";
import { fetchScheduleItems, addScheduleItem, updateScheduleItem, deleteScheduleItem, ScheduleItem } from "@/services/schedulingService";
import { fetchWorkOrders, WorkOrder } from "@/services/workOrderService";
import { fetchTeamMembers, TeamMember } from "@/services/teamService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Scheduling: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<ScheduleItem | undefined>(undefined);

  // Fetch data
  const { data: scheduleItems = [] } = useQuery({
    queryKey: ['scheduleItems'],
    queryFn: fetchScheduleItems,
  });

  const { data: workOrders = [] } = useQuery({
    queryKey: ['workOrders'],
    queryFn: fetchWorkOrders,
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers,
  });

  // Mutations
  const addAppointmentMutation = useMutation({
    mutationFn: addScheduleItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleItems'] });
      toast({
        title: "Success",
        description: "Appointment created successfully.",
      });
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error("Failed to create appointment:", error);
      toast({
        title: "Error",
        description: "Failed to create appointment.",
        variant: "destructive",
      });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      updateScheduleItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleItems'] });
      toast({
        title: "Success",
        description: "Appointment updated successfully.",
      });
      setIsFormOpen(false);
      setEditingAppointment(undefined);
    },
    onError: (error) => {
      console.error("Failed to update appointment:", error);
      toast({
        title: "Error",
        description: "Failed to update appointment.",
        variant: "destructive",
      });
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: deleteScheduleItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleItems'] });
      toast({
        title: "Success",
        description: "Appointment deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to delete appointment:", error);
      toast({
        title: "Error",
        description: "Failed to delete appointment.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = (data: any) => {
    // Ensure data has the correct types before passing to mutation
    const appointmentData = {
      ...data,
      // These are already converted to numbers or null in the form's handleSubmit
    };
    
    if (editingAppointment) {
      updateAppointmentMutation.mutate({
        id: editingAppointment.id,
        updates: appointmentData,
      });
    } else {
      addAppointmentMutation.mutate(appointmentData);
    }
  };

  // Handle edit button click
  const handleEdit = (appointment: ScheduleItem) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  // Handle delete button click
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      deleteAppointmentMutation.mutate(id);
    }
  };

  // Open form for new appointment
  const openNewAppointmentForm = () => {
    setEditingAppointment(undefined);
    setIsFormOpen(true);
  };

  return (
    <Layout>
      <PageHeader
        title="Scheduling"
        description="Manage and schedule work orders and team assignments."
        actionLabel="New Appointment"
        actionIcon={<Plus size={16} />}
        onAction={openNewAppointmentForm}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <SchedulingCalendar 
            scheduleItems={scheduleItems}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
          <div className="mt-6">
            <TeamAvailability 
              teamMembers={teamMembers}
              scheduleItems={scheduleItems}
              selectedDate={selectedDate}
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <AppointmentsList 
            appointments={scheduleItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
            date={selectedDate}
          />
        </div>
      </div>

      <AppointmentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAppointment(undefined);
        }}
        onSubmit={handleSubmit}
        appointment={editingAppointment}
        workOrders={workOrders}
        teamMembers={teamMembers}
        selectedDate={selectedDate}
      />
    </Layout>
  );
};

export default Scheduling;
