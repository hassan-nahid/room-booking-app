import React from 'react';
import { HelpCircle, BookOpen, MessageCircle } from 'lucide-react';

const Help = () => {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help</h1>
          <p className="text-gray-600">Find answers and get assistance</p>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <HelpCircle className="w-12 h-12 text-blue-500" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Help Center Coming Soon
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We're building a comprehensive help center to assist you with all your questions and provide quick solutions.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              <span>Knowledge Base</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              <span>Quick Answers</span>
            </div>
            <div className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              <span>Tutorials</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;