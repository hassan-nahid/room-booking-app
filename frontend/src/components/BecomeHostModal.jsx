import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const BecomeHostModal = ({ isOpen, onClose }) => {
  const { user, updateUser, becomeHost, loading, error, clearError } = useAuth();
  const [step, setStep] = useState('check'); // 'check', 'update', 'success'
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Check if user has all required host information
  const checkHostRequirements = () => {
    const requirements = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      dateOfBirth: user?.dateOfBirth,
      // Add more requirements as needed
    };

    const missing = Object.entries(requirements)
      .filter(([, value]) => !value || value.trim() === '')
      .map(([key]) => key);

    return { complete: missing.length === 0, missing };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
      
      if (age < 18) {
        errors.dateOfBirth = 'You must be at least 18 years old to become a host';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await updateUser(formData);
      setStep('check');
    } catch (err) {
      console.error('Profile update error:', err);
    }
  };

  const handleBecomeHost = async () => {
    try {
      // Show immediate feedback with progress steps
      setStep('processing');
      
      // Add small delay to show processing state (can be removed if backend is fast)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await becomeHost();
      setStep('success');
    } catch (err) {
      console.error('Become host error:', err);
      setStep('check'); // Go back to check step on error
    }
  };

  const handleClose = () => {
    setStep('check');
    setFormErrors({});
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  const { complete, missing } = checkHostRequirements();

  const renderCheckStep = () => (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-4">Ready to become a host?</h3>
      
      {complete ? (
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-green-900">Profile Complete!</h4>
              <p className="text-sm text-green-700">
                You have all the required information to become a host.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">As a host, you'll be able to:</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• List your properties</li>
              <li>• Manage bookings and calendar</li>
              <li>• Communicate with guests</li>
              <li>• Earn money from hosting</li>
              <li>• Access host analytics</li>
            </ul>
          </div>
          
          <button
            onClick={handleBecomeHost}
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Become a Host'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-yellow-50 rounded-lg">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">Profile Incomplete</h4>
              <p className="text-sm text-yellow-700 mb-2">
                Please complete your profile to become a host.
              </p>
              <p className="text-sm text-yellow-700">
                Missing information: {missing.join(', ')}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setStep('update')}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600"
          >
            Complete Profile
          </button>
        </div>
      )}
    </div>
  );

  const renderUpdateStep = () => (
    <div className="p-6 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-medium mb-4">Complete Your Profile</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                formErrors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.firstName && (
              <p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                formErrors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.lastName && (
              <p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 inline mr-1" />
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
              formErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
              formErrors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date of Birth *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
              formErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{formErrors.dateOfBirth}</p>
          )}
        </div>

        {/* Address (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            Address (Optional)
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Street address"
          />
        </div>

        {/* City and Country */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => setStep('check')}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="p-6 text-center">
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 border-4 border-red-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Becoming a Host...</h3>
      <p className="text-gray-600 mb-4">
        We're setting up your host account. This will just take a moment.
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-center text-sm text-gray-500">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
          Verifying profile information
        </div>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <div className="w-2 h-2 bg-red-300 rounded-full mr-2"></div>
          Setting up host dashboard
        </div>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
          Finalizing account
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="p-6 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome, Host!</h3>
      <p className="text-gray-600 mb-6">
        Congratulations! You're now a host. You can start listing your properties and welcoming guests.
      </p>
      <button
        onClick={handleClose}
        className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600"
      >
        Get Started
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {step === 'check' && 'Become a Host'}
            {step === 'update' && 'Complete Profile'}
            {step === 'success' && 'Success!'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {step === 'check' && renderCheckStep()}
        {step === 'update' && renderUpdateStep()}
        {step === 'processing' && renderProcessingStep()}
        {step === 'success' && renderSuccessStep()}
      </div>
    </div>
  );
};

export default BecomeHostModal;