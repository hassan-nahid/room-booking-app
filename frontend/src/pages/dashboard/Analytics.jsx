import React from 'react';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your property performance and insights</p>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <BarChart3 className="w-12 h-12 text-indigo-500" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Analytics Coming Soon
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Get detailed insights into your property performance, booking trends, and revenue analytics to optimize your listings.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              <span>Performance Metrics</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span>Revenue Trends</span>
            </div>
            <div className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              <span>Booking Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;