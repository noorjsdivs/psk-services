
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CalendarClock, Calendar, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppointmentCard from '@/components/AppointmentCard';
import { toast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  date: string;
  time_slot: string;
  event_type: string;
  name: string;
  location: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  details: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true })
          .limit(10);
          
        if (error) {
          throw error;
        }
        
        setAppointments(data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Failed to load appointments",
          description: "Couldn't retrieve your appointment data.",
          variant: "destructive"
        });
      } finally {
        setLoadingAppointments(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-32 px-4">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-t-psyco-green-DEFAULT border-psyco-black-light rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto py-32 px-4">
      <div className="glassmorphism p-8 rounded-lg">
        <h1 className="text-3xl font-bold text-white mb-6">User Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-psyco-black-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-3">Profile</h2>
            <div className="space-y-2">
              <p className="text-gray-300">Email: {user.email}</p>
              <p className="text-gray-300">User ID: {user.id.substring(0, 8)}...</p>
              <p className="text-gray-300">Last Sign In: {new Date(user.last_sign_in_at || '').toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="bg-psyco-black-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-3">Recent Activity</h2>
            <p className="text-gray-300">No recent activity to display.</p>
          </div>
          
          <div className="bg-psyco-black-card p-6 rounded-lg col-span-1 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-psyco-green-DEFAULT mr-2" />
                <h2 className="text-xl font-semibold text-white">Upcoming Appointments</h2>
              </div>
              <Button 
                variant="outline"
                className="border-psyco-green-DEFAULT text-psyco-green-DEFAULT hover:bg-psyco-green-DEFAULT/10"
                onClick={() => navigate('/booking')}
              >
                <PlusCircle size={16} className="mr-2" />
                Book New
              </Button>
            </div>
            
            {loadingAppointments ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-t-psyco-green-DEFAULT border-psyco-black-light rounded-full animate-spin"></div>
              </div>
            ) : appointments.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {appointments.map(appointment => (
                  <AppointmentCard
                    key={appointment.id}
                    date={appointment.date}
                    time_slot={appointment.time_slot}
                    event_type={appointment.event_type}
                    location={appointment.location}
                    status={appointment.status}
                    details={appointment.details}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarClock className="h-12 w-12 text-psyco-green-DEFAULT/50 mx-auto mb-2" />
                <p className="text-gray-300 mb-4">No upcoming appointments.</p>
                <Button 
                  className="bg-psyco-green-DEFAULT hover:bg-psyco-green-dark text-white"
                  onClick={() => navigate('/booking')}
                >
                  Schedule an Appointment
                </Button>
              </div>
            )}
          </div>
          
          <div className="bg-psyco-black-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-3">Resources</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Personal Development Guide</li>
              <li>Mindfulness Exercises</li>
              <li>Recommended Reading</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
