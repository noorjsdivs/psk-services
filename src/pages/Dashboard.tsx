
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

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
          
          <div className="bg-psyco-black-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-3">Upcoming Appointments</h2>
            <p className="text-gray-300">No upcoming appointments.</p>
            <button 
              className="mt-4 bg-psyco-green-DEFAULT hover:bg-psyco-green-dark text-white px-4 py-2 rounded transition-colors"
              onClick={() => navigate('/booking')}
            >
              Schedule an Appointment
            </button>
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
