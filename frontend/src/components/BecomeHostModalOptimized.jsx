import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const BecomeHostModalOptimized = ({ isOpen, onClose }) => {
  const { user, updateUser, becomeHost, loading, error, clearError } = useAuth();
  const [step, setStep] = useState('check'); // 'check', 'update', 'processing', 'success'
  const [processingStep, setProcessingStep] = useState(0);
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

  const processingSteps = [
    { label: 'Verifying profile information', icon: User },
    { label: 'Setting up host dashboard', icon: Shield },
    { label: 'Initializing host features', icon: Clock },
    { label: 'Finalizing account', icon: CheckCircle }
  ];

  // Simulate processing steps with better UX
  useEffect(() => {
    if (step === 'processing') {
      const interval = setInterval(() => {
        setProcessingStep(prev => {
          if (prev < processingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 400); // Fast progression for better UX

      return () => clearInterval(interval);
    }
  }, [step, processingSteps.length]);

  // Check if user has all required host information
  const checkHostRequirements = () => {
    const requirements = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      dateOfBirth: user?.dateOfBirth,
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
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
      setStep('processing');
      setProcessingStep(0);
      
      // Use optimistic update for better UX
      const optimisticTimeout = setTimeout(() => {
        setStep('success');
      }, 2000); // Show success after 2 seconds max

      await becomeHost();
      
      // Clear the timeout if the API responds faster
      clearTimeout(optimisticTimeout);
      
      // Ensure we've shown at least some processing steps
      setTimeout(() => {
        setStep('success');
      }, Math.max(0, 1600 - (processingStep * 400)));
      
    } catch (err) {
      console.error('Become host error:', err);
      setStep('check');
    }
  };

  const handleClose = () => {
    setStep('check');
    setProcessingStep(0);
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
            <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-900">Profile Complete!</h4>
              <p className="text-sm text-green-700">
                You have all the required information to become a host.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">As a host, you'll be able to:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                List your properties
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Manage bookings
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Communicate with guests
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Earn money from hosting
              </div>
            </div>
          </div>
          
          <button
            onClick={handleBecomeHost}
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing...' : 'Become a Host Now'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-yellow-50 rounded-lg">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-900">Profile Incomplete</h4>
              <p className="text-sm text-yellow-700 mb-2">
                Please complete your profile to become a host.
              </p>
              <p className="text-sm text-yellow-700">
                Missing: {missing.map(field => field.replace(/([A-Z])/g, ' $1').toLowerCase()).join(', ')}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setStep('update')}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
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
              <User className="w-4 h-4 inline mr-2" />
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                formErrors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.firstName && (
              <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-2" />
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                formErrors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.lastName && (
              <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 inline mr-2" />
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
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
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
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
            <Calendar className="w-4 h-4 inline mr-2" />
            Date of Birth *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
              formErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{formErrors.dateOfBirth}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => setStep('check')}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="p-6 text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 border-4 border-red-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 bg-red-50 rounded-full flex items-center justify-center">
          <Shield className="w-6 h-6 text-red-500" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Becoming a Host...</h3>
      <p className="text-gray-600 mb-6">
        Setting up your host account with all the features you need.
      </p>
      
      <div className="space-y-3 max-w-sm mx-auto">
        {processingSteps.map((stepInfo, index) => {
          const StepIcon = stepInfo.icon;
          const isActive = index === processingStep;
          const isCompleted = index < processingStep;
          
          return (
            <div
              key={index}
              className={`flex items-center text-sm transition-all duration-300 ${
                isActive 
                  ? 'text-red-600 font-medium' 
                  : isCompleted 
                    ? 'text-green-600' 
                    : 'text-gray-400'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                isActive 
                  ? 'bg-red-100 border-2 border-red-500' 
                  : isCompleted 
                    ? 'bg-green-100 border-2 border-green-500' 
                    : 'bg-gray-100 border-2 border-gray-300'
              }`}>
                <StepIcon className="w-3 h-3" />
              </div>
              <span className="flex-1 text-left">{stepInfo.label}</span>
              {isActive && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-2"></div>
              )}
              {isCompleted && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-xs text-gray-500">
        This usually takes less than 10 seconds
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="p-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-12 h-12 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome, Host!</h3>
      <p className="text-gray-600 mb-6">
        🎉 Congratulations! You're now officially an Aircnc host. Start listing your properties and welcoming guests from around the world.
      </p>
      
      <div className="bg-red-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-red-900 mb-2">Next Steps:</h4>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• Create your first property listing</li>
          <li>• Set up your availability calendar</li>
          <li>• Add photos and descriptions</li>
          <li>• Start receiving bookings!</li>
        </ul>
      </div>
      
      <button
        onClick={handleClose}
        className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
      >
        Go to Host Dashboard
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {step === 'check' && 'Become a Host'}
            {step === 'update' && 'Complete Profile'}
            {step === 'processing' && 'Setting Up...'}
            {step === 'success' && 'Success!'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={step === 'processing'}
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

export default BecomeHostModalOptimized;