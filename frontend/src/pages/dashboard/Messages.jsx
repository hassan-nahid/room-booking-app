import React from 'react';
import { MessageCircle, Users, Send } from 'lucide-react';

const Messages = () => {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with hosts and guests</p>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <MessageCircle className="w-12 h-12 text-blue-500" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Messages Coming Soon
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Stay connected with hosts and guests through our integrated messaging system. Real-time chat functionality is on the way!
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              <span>Real-time Chat</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>Group Messages</span>
            </div>
            <div className="flex items-center">
              <Send className="w-5 h-5 mr-2" />
              <span>Quick Replies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;