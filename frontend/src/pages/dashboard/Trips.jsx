import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Star, MessageCircle, Home, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard.jsx';
import { bookingsApi } from '../../services/api.js';

const Trips = () => {
  const { currentRole } = useDashboard();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch user trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await bookingsApi.getUserTrips();
        setTrips(response.data.bookings || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to load trips. Please try again.');
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Filter trips based on status
  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    return trip.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Trips</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <button 
                onClick={() => setFilter('all')}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  filter === 'all' 
                    ? 'border-red-500 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Trips ({trips.length})
              </button>
              <button 
                onClick={() => setFilter('confirmed')}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  filter === 'confirmed' 
                    ? 'border-red-500 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active ({trips.filter(t => t.status === 'confirmed').length})
              </button>
              <button 
                onClick={() => setFilter('completed')}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  filter === 'completed' 
                    ? 'border-red-500 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed ({trips.filter(t => t.status === 'completed').length})
              </button>
              <button 
                onClick={() => setFilter('cancelled')}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  filter === 'cancelled' 
                    ? 'border-red-500 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cancelled ({trips.filter(t => t.status === 'cancelled').length})
              </button>
            </nav>
          </div>
        </div>

        {/* Trips List */}
        <div className="space-y-6">
          {filteredTrips.map((trip) => (
            <div key={trip._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-48 md:flex-shrink-0">
                  <img 
                    src={trip.property?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300'} 
                    alt={trip.property?.title || 'Property'}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{trip.property?.title || 'Property'}</h3>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(trip.status)}
                            {trip.status}
                          </span>
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          {trip.property?.address ? 
                            `${trip.property.address.city}, ${trip.property.address.state}` : 
                            'Location not available'
                          }
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600 mb-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          {formatDate(trip.checkIn)} - {formatDate(trip.checkOut)}
                        </span>
                        <span className="text-sm ml-4 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {trip.numberOfGuests} guests
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <Home className="w-4 h-4 mr-1" />
                          Hosted by {trip.host?.firstName} {trip.host?.lastName}
                        </span>
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
                        
                        {trip.status === 'confirmed' && (
                          <button className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <p className="text-lg font-bold text-gray-900">${trip.totalAmount}</p>
                      <p className="text-sm text-gray-600">total</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {trip.numberOfNights} nights
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredTrips.length === 0 && trips.length > 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-6">No trips match the selected filter</p>
            <button 
              onClick={() => setFilter('all')}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Show All Trips
            </button>
          </div>
        )}

        {filteredTrips.length === 0 && trips.length === 0 && (
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