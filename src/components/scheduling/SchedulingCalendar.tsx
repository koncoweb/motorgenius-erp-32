
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { ScheduleItem } from '@/services/schedulingService';

interface SchedulingCalendarProps {
  scheduleItems: ScheduleItem[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export const SchedulingCalendar: React.FC<SchedulingCalendarProps> = ({
  scheduleItems,
  onDateSelect,
  selectedDate
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Function to get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return scheduleItems.filter(item => 
      item.start_time.startsWith(formattedDate)
    ).length;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          month={currentMonth}
          className="rounded-md border"
          modifiers={{
            hasAppointments: (date) => getAppointmentsForDate(date) > 0,
          }}
          modifiersStyles={{
            hasAppointments: { 
              fontWeight: 'bold',
              backgroundColor: 'rgba(var(--primary), 0.1)',
              position: 'relative',
            }
          }}
          components={{
            DayContent: ({ day }) => (
              <div className="flex flex-col items-center justify-center">
                <span>{format(day, 'd')}</span>
                {getAppointmentsForDate(day) > 0 && (
                  <span className="text-xs text-primary mt-1">
                    {getAppointmentsForDate(day)} appt
                  </span>
                )}
              </div>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};
