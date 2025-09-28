import React from 'react';
import { MapPin, Calendar, Star, MessageCircle, Home, Users } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard.jsx';

const Trips = () => {
  const { currentRole } = useDashboard();

  // Mock trips data
  const trips = [
    {
      id: 1,
      property: "Beautiful Beachfront Villa",
      location: "Cox's Bazar, Bangladesh",
      host: "Alice Johnson",
      checkIn: "2025-10-15",
      checkOut: "2025-10-18",
      guests: 4,
      total: 450,
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300"
    },
    {
      id: 2,
      property: "Cozy Mountain Cabin",
      location: "Sylhet, Bangladesh",
      host: "Bob Wilson",
      checkIn: "2025-11-01",
      checkOut: "2025-11-05",
      guests: 2,
      total: 320,
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300"
    },
    {
      id: 3,
      property: "Modern City Apartment",
      location: "Dhaka, Bangladesh",
      host: "Carol Davis",
      checkIn: "2025-09-20",
      checkOut: "2025-09-23",
      guests: 3,
      total: 280,
      status: "completed",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentRole === 'host' ? 'Guest Bookings' : 'My Trips'}
              </h1>
              <p className="text-gray-600">
                {currentRole === 'host' 
                  ? 'Manage bookings for your properties' 
                  : 'View and manage your travel bookings'
                }
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentRole === 'host' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {currentRole === 'host' ? '🏠 Host View' : '✈️ Guest View'}
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="border-b-2 border-red-500 py-2 px-1 text-sm font-medium text-red-600">
                All Trips
              </button>
              <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Upcoming
              </button>
              <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Completed
              </button>
              <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Cancelled
              </button>
            </nav>
          </div>
        </div>

        {/* Trips List */}
        <div className="space-y-6">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-48 md:flex-shrink-0">
                  <img 
                    src={trip.image} 
                    alt={trip.property}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{trip.property}</h3>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                          {trip.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{trip.location}</span>
                      </div>

                      <div className="flex items-center text-gray-600 mb-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          {new Date(trip.checkIn).toLocaleDateString()} - {new Date(trip.checkOut).toLocaleDateString()}
                        </span>
                        <span className="text-sm ml-4">{trip.guests} guests</span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        Hosted by {trip.host}
                      </p>

                      <div className="flex items-center space-x-4">
                        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact Host
                        </button>
                        
                        {trip.status === 'completed' && (
                          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <Star className="w-4 h-4 mr-2" />
                            Write Review
                          </button>
                        )}
                        
                        {trip.status === 'upcoming' && (
                          <button className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <p className="text-lg font-bold text-gray-900">${trip.total}</p>
                      <p className="text-sm text-gray-600">total</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {trips.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-6">Start planning your next adventure</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Explore Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;