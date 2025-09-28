import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard.jsx';
import BecomeHostModalOptimized from '../components/BecomeHostModalOptimized';
import { 
  Calendar, 
  Heart, 
  Star, 
  TrendingUp, 
  MapPin,
  DollarSign,
  Clock,
  Award,
  Users,
  Home,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { currentRole } = useDashboard();
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const stats = {
    totalBookings: 12,
    totalEarnings: user.isHost ? 2450 : 0,
    averageRating: user.isHost ? 4.8 : 0,
    completedTrips: user.isHost ? 0 : 8,
    savedProperties: 15,
    upcomingTrips: 2
  };

  const recentBookings = [
    {
      id: 1,
      property: "Beautiful Beachfront Villa",
      guest: "John Doe",
      checkIn: "2025-10-15",
      checkOut: "2025-10-18",
      amount: 450,
      status: "confirmed"
    },
    {
      id: 2,
      property: "Cozy Mountain Cabin",
      guest: "Jane Smith",
      checkIn: "2025-10-20",
      checkOut: "2025-10-23",
      amount: 320,
      status: "pending"
    }
  ];

  const upcomingTrips = [
    {
      id: 1,
      property: "Modern City Apartment",
      host: "Alice Johnson",
      checkIn: "2025-10-12",
      checkOut: "2025-10-15",
      amount: 280
    },
    {
      id: 2,
      property: "Rustic Forest Retreat",
      host: "Bob Wilson",
      checkIn: "2025-11-01",
      checkOut: "2025-11-05",
      amount: 520
    }
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {currentRole === 'host' && user.isHost
              ? "Here's your hosting dashboard with property management tools"
              : "Here's your guest dashboard with trip bookings and favorites"
            }
          </p>
          <div className="mt-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              currentRole === 'host' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {currentRole === 'host' ? '🏠 Host View' : '✈️ Guest View'}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {(currentRole === 'host' && user.isHost) ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Home className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Properties</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed Trips</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedTrips}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Upcoming Trips</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.upcomingTrips}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Saved Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.savedProperties}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Member Level</p>
                    <p className="text-2xl font-bold text-gray-900">Gold</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Become a Host Section for non-hosts */}
        {!user.isHost && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">Become a Host</h2>
                  <p className="text-red-100 mb-4">
                    Start earning money by sharing your space with travelers from around the world.
                  </p>
                  <ul className="text-sm text-red-100 space-y-1">
                    <li>• Earn extra income</li>
                    <li>• Meet people from around the world</li>
                    <li>• Share your local knowledge</li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowBecomeHostModal(true)}
                  className="bg-white text-red-500 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Become a Host
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {user.isHost ? 'Recent Bookings' : 'Upcoming Trips'}
              </h2>
            </div>
            <div className="p-6">
              {user.isHost ? (
                <div className="space-y-4">
                  {recentBookings.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{booking.property}</h3>
                        <p className="text-sm text-gray-600">Guest: {booking.guest}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${booking.amount}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTrips.map(trip => (
                    <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{trip.property}</h3>
                        <p className="text-sm text-gray-600">Host: {trip.host}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(trip.checkIn).toLocaleDateString()} - {new Date(trip.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${trip.amount}</p>
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          confirmed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {user.isHost ? (
                  <>
                    <button className="flex items-center p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Home className="w-6 h-6 text-gray-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Create Property</h3>
                        <p className="text-sm text-gray-600">List a new property for rent</p>
                      </div>
                    </button>
                    <button className="flex items-center p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Calendar className="w-6 h-6 text-gray-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Manage Calendar</h3>
                        <p className="text-sm text-gray-600">Update availability and pricing</p>
                      </div>
                    </button>
                    <button className="flex items-center p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <TrendingUp className="w-6 h-6 text-gray-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">View Analytics</h3>
                        <p className="text-sm text-gray-600">Check performance metrics</p>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex items-center p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <MapPin className="w-6 h-6 text-gray-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Find Properties</h3>
                        <p className="text-sm text-gray-600">Search for your next stay</p>
                      </div>
                    </button>
                    <button className="flex items-center p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Heart className="w-6 h-6 text-gray-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">View Wishlists</h3>
                        <p className="text-sm text-gray-600">Manage your saved properties</p>
                      </div>
                    </button>
                    <button className="flex items-center p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Users className="w-6 h-6 text-gray-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Invite Friends</h3>
                        <p className="text-sm text-gray-600">Share Aircnc with friends</p>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Become Host Modal */}
      <BecomeHostModalOptimized 
        isOpen={showBecomeHostModal}
        onClose={() => setShowBecomeHostModal(false)}
      />
    </div>
  );
};

export default Dashboard;