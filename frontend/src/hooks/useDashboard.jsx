import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentRole, setCurrentRole] = useState('guest'); // 'guest' or 'host'

  // Initialize role based on user's host status
  useEffect(() => {
    if (user?.isHost) {
      // Default to guest view, but allow switching
      setCurrentRole('guest');
    } else {
      // Non-hosts can only see guest view
      setCurrentRole('guest');
    }
  }, [user?.isHost]);

  const switchRole = (role) => {
    if (user?.isHost || role === 'guest') {
      setCurrentRole(role);
    }
  };

  const value = {
    currentRole,
    switchRole,
    isHost: user?.isHost || false,
    canSwitchRoles: user?.isHost || false
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;