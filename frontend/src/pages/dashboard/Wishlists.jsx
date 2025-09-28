import React from 'react';
import { Heart, Star, Clock } from 'lucide-react';

const Wishlists = () => {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wishlists</h1>
          <p className="text-gray-600">Save and organize your favorite properties</p>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Wishlists Coming Soon
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We're working on an amazing wishlist feature that will let you save and organize your favorite properties. Stay tuned!
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              <span>Save Favorites</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>Quick Access</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              <span>Share Lists</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlists;