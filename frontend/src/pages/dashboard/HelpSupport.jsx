import React from 'react';
import { HelpCircle, Phone, Mail } from 'lucide-react';

const HelpSupport = () => {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600">Get assistance and find answers to your questions</p>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <HelpCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Help & Support Coming Soon
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We're building a comprehensive help center with FAQs, tutorials, and 24/7 support to assist you with all your needs.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              <span>FAQ Center</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <span>Live Chat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;