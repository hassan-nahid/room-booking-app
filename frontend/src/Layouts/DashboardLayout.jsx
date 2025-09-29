import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { DashboardProvider, useDashboard } from '../hooks/useDashboard.jsx';
import { 
  Home, 
  Calendar, 
  Heart, 
  Star, 
  TrendingUp, 
  Users, 
  MapPin,
  Settings,
  CreditCard,
  MessageSquare,
  HelpCircle,
  LogOut,
  User,
  Menu
} from 'lucide-react';

const DashboardLayoutContent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { currentRole, switchRole, canSwitchRoles } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access dashboard</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Navigation items based on current role view
  const getNavigationItems = () => {
    if (currentRole === 'host' && user?.isHost) {
      return [
        { name: 'Host Overview', href: '/dashboard', icon: Home, current: location.pathname === '/dashboard' },
        { name: 'Properties', href: '/dashboard/properties', icon: MapPin, current: location.pathname === '/dashboard/properties' },
        { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar, current: location.pathname === '/dashboard/bookings' },
        { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp, current: location.pathname === '/dashboard/analytics' },
        { name: 'Reviews', href: '/dashboard/reviews', icon: Star, current: location.pathname === '/dashboard/reviews' },
        { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, current: location.pathname === '/dashboard/messages' },
        { name: 'Earnings', href: '/dashboard/earnings', icon: CreditCard, current: location.pathname === '/dashboard/earnings' },
      ];
    } else {
      return [
        { name: 'Guest Overview', href: '/dashboard', icon: Home, current: location.pathname === '/dashboard' },
        { name: 'My Trips', href: '/dashboard/trips', icon: MapPin, current: location.pathname === '/dashboard/trips' },
        { name: 'Wishlists', href: '/dashboard/wishlists', icon: Heart, current: location.pathname === '/dashboard/wishlists' },
        { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, current: location.pathname === '/dashboard/messages' },
        { name: 'Reviews', href: '/dashboard/reviews', icon: Star, current: location.pathname === '/dashboard/reviews' },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  const commonItems = [
    { name: 'Profile Switcher', href: '/dashboard/profile-switcher', icon: User, current: location.pathname === '/dashboard/profile-switcher' },
    { name: 'Account Settings', href: '/dashboard/settings', icon: Settings, current: location.pathname === '/dashboard/settings' },
    { name: 'Help & Support', href: '/dashboard/help', icon: HelpCircle, current: location.pathname === '/dashboard/help' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200">
            {/* Logo */}
            <Link to={"/"} className="flex items-center flex-shrink-0 px-4">
              <img src="/aircnc.png" alt="Aircnc" className="h-8 w-auto" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Dashboard</span>
            </Link>

            {/* User Info */}
            <div className="px-4 py-4 mt-6 bg-gray-50 mx-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.firstName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {currentRole === 'host' ? 'Host View' : 'Guest View'}
                  </p>
                </div>
              </div>
              
              {/* Role Switcher */}
              {canSwitchRoles && (
                <div className="flex bg-white rounded-lg p-1">
                  <button
                    onClick={() => switchRole('guest')}
                    className={`flex-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      currentRole === 'guest'
                        ? 'bg-red-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Guest
                  </button>
                  <button
                    onClick={() => switchRole('host')}
                    className={`flex-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      currentRole === 'host'
                        ? 'bg-red-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Host
                  </button>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'bg-red-100 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      item.current ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </button>
              ))}

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Common Items */}
              {commonItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'bg-red-100 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      item.current ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </button>
              ))}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                Log out
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile sidebar */}
        <div className="md:hidden">
          {/* Mobile header will be added here if needed */}
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1">
          {/* Top header for mobile and additional actions */}
          <header className="bg-white shadow-sm border-b border-gray-200 md:hidden">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src="/aircnc.png" alt="Aircnc" className="h-6 w-auto" />
                  <span className="ml-2 text-lg font-semibold text-gray-900">Dashboard</span>
                </div>
                <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

// Main component that wraps content with DashboardProvider
const DashboardLayout = () => {
  return (
    <DashboardProvider>
      <DashboardLayoutContent />
    </DashboardProvider>
  );
};

export default DashboardLayout;