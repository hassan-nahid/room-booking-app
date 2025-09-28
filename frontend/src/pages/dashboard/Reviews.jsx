import React from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';

const Reviews = () => {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews</h1>
          <p className="text-gray-600">Manage your property reviews and feedback</p>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
            <Star className="w-12 h-12 text-yellow-500" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Reviews Coming Soon
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Manage all your property reviews, respond to feedback, and track your ratings. Our comprehensive review system is coming soon!
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              <span>Rating Analytics</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className="w-5 h-5 mr-2" />
              <span>Response Tools</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              <span>Review Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;