import React from 'react';
import { DollarSign, CreditCard, Wallet } from 'lucide-react';

const Earnings = () => {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings</h1>
          <p className="text-gray-600">Track your income and payouts</p>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <DollarSign className="w-12 h-12 text-emerald-500" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Earnings Coming Soon
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Monitor your earnings, track payouts, and manage your financial dashboard with detailed reports and transaction history.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              <span>Revenue Tracking</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              <span>Payout Management</span>
            </div>
            <div className="flex items-center">
              <Wallet className="w-5 h-5 mr-2" />
              <span>Financial Reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;