
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember } from '@/services/teamService';
import { ScheduleItem } from '@/services/schedulingService';
import { format, parseISO, isWithinInterval } from 'date-fns';

interface TeamAvailabilityProps {
  teamMembers: TeamMember[];
  scheduleItems: ScheduleItem[];
  selectedDate: Date;
}

export const TeamAvailability: React.FC<TeamAvailabilityProps> = ({
  teamMembers,
  scheduleItems,
  selectedDate,
}) => {
  // Check if team member is busy at a particular time
  const isMemberBusy = (memberId: string, date: Date) => {
    const memberAppointments = scheduleItems.filter(
      item => item.team_member_id === parseInt(memberId) && item.status !== 'cancelled'
    );

    return memberAppointments.some(appointment => {
      const startTime = parseISO(appointment.start_time);
      const endTime = parseISO(appointment.end_time);
      return isWithinInterval(date, { start: startTime, end: endTime });
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'offsite':
        return 'bg-blue-100 text-blue-800';
      case 'leave':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return 'N/A';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Team Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map(member => {
            const memberIsBusy = isMemberBusy(member.id, selectedDate);
            const displayStatus = memberIsBusy ? 'busy' : member.status;
            
            return (
              <div key={member.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted/50">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{member.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{member.role}</p>
                </div>
                <Badge variant="outline" className={getStatusColor(displayStatus)}>
                  {displayStatus}
                </Badge>
              </div>
            );
          })}
          
          {teamMembers.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No team members available.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
