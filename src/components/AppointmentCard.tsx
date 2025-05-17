
import React from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarClock, MapPin, Music, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

interface AppointmentCardProps {
  date: string;
  time_slot: string;
  event_type: string;
  location: string;
  status: AppointmentStatus;
  details?: string | null;
}

const AppointmentCard = ({
  date,
  time_slot,
  event_type,
  location,
  status,
  details
}: AppointmentCardProps) => {
  // Parse the date string to a Date object
  const appointmentDate = parseISO(date);
  
  // Map status to appropriate color
  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-300",
    confirmed: "bg-green-500/20 text-green-300",
    cancelled: "bg-red-500/20 text-red-300"
  };
  
  return (
    <div className="bg-psyco-black-card p-4 rounded-lg border border-psyco-green-muted/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">{event_type}</h3>
        <Badge className={statusColors[status] || "bg-gray-500/20 text-gray-300"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
      
      <div className="space-y-2 text-gray-300">
        <div className="flex items-center">
          <CalendarClock className="w-4 h-4 mr-2 text-psyco-green-DEFAULT" />
          <span>{format(appointmentDate, 'MMMM dd, yyyy')} at {time_slot}</span>
        </div>
        
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-psyco-green-DEFAULT" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center">
          <Music className="w-4 h-4 mr-2 text-psyco-green-DEFAULT" />
          <span>{event_type}</span>
        </div>
        
        {details && (
          <div className="mt-3 pt-3 border-t border-psyco-green-muted/20">
            <div className="flex items-start">
              <Tag className="w-4 h-4 mr-2 text-psyco-green-DEFAULT mt-1" />
              <span className="text-sm">{details}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
