import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Star, MessageCircle, CheckCircle, XCircle, AlertCircle, User, Phone, Mail } from 'lucide-react';
import { bookingsApi } from '../../services/api.js';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch host bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingsApi.getHostBookings();
        setBookings(response.data.bookings || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again.');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on status
  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
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
                <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Bookings</h3>
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
              <h1 className="text-2xl font-bold text-gray-900">Property Bookings</h1>
              <p className="text-gray-600">Manage reservations for your properties</p>
            </div>
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              🏠 Host Dashboard
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
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Bookings ({bookings.length})
              </button>
              <button 
                onClick={() => setFilter('confirmed')}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  filter === 'confirmed' 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active ({bookings.filter(b => b.status === 'confirmed').length})
              </button>
              <button 
                onClick={() => setFilter('pending')}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  filter === 'pending' 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({bookings.filter(b => b.status === 'pending').length})
              </button>
              <button 
                onClick={() => setFilter('completed')}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  filter === 'completed' 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed ({bookings.filter(b => b.status === 'completed').length})
              </button>
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-48 md:flex-shrink-0">
                  <img 
                    src={booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300'} 
                    alt={booking.property?.title || 'Property'}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-900">{booking.property?.title || 'Property'}</h3>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(booking.status)}
                              {booking.status}
                            </span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Guest Information */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-900 flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            Guest Details
                          </h4>
                          <p className="text-sm text-gray-600">
                            {booking.guest?.firstName} {booking.guest?.lastName}
                          </p>
                          {booking.guest?.email && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {booking.guest.email}
                            </p>
                          )}
                          {booking.guestDetails?.phone && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {booking.guestDetails.phone}
                            </p>
                          )}
                        </div>

                        {/* Booking Information */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-900 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Booking Details
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {booking.numberOfGuests} guests • {booking.numberOfNights} nights
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>${booking.totalAmount}</strong> total
                          </p>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Special Requests</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {booking.specialRequests}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-4">
                        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message Guest
                        </button>
                        
                        {booking.status === 'pending' && (
                          <>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700">
                              Accept
                            </button>
                            <button className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">
                              Decline
                            </button>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <button className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">
                            Cancel Booking
                          </button>
                        )}

                        {booking.status === 'completed' && (
                          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <Star className="w-4 h-4 mr-2" />
                            Review Guest
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty states */}
        {filteredBookings.length === 0 && bookings.length > 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">No bookings match the selected filter</p>
            <button 
              onClick={() => setFilter('all')}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Show All Bookings
            </button>
          </div>
        )}

        {filteredBookings.length === 0 && bookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Your property bookings will appear here once guests make reservations</p>
            <button 
              onClick={() => window.location.href = '/dashboard/properties'}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Manage Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;