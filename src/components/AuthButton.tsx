
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

const AuthButton = () => {
  const { user, signOut, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="ml-4">
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center ml-4 space-x-2">
        <Link to="/dashboard">
          <Button 
            variant="ghost"
            className="text-white hover:text-green-400 hover:bg-transparent"
          >
            <User size={18} className="mr-2" />
            Dashboard
          </Button>
        </Link>
        <Button 
          onClick={() => signOut()}
          variant="outline" 
          className="border-psyco-green-DEFAULT text-psyco-green-DEFAULT hover:bg-psyco-green-DEFAULT/10"
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Link to="/auth" className="ml-4">
      <Button className="bg-psyco-green-DEFAULT hover:bg-psyco-green-dark">
        Sign In
      </Button>
    </Link>
  );
};

export default AuthButton;
