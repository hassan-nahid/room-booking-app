import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

const Bookings = () => {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
          <p className="text-gray-600">Manage your property reservations and bookings</p>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <Calendar className="w-12 h-12 text-purple-500" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Bookings Coming Soon
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Manage all your property bookings, view upcoming reservations, and handle check-ins and check-outs efficiently.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Reservation Calendar</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>Check-in Management</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>Guest Communication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;