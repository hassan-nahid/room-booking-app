import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard.jsx';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Home,
  Users,
  Star,
  Award,
  Shield,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const ProfileSwitcher = () => {
  const { user, updateUser, loading, error } = useAuth();
  const { currentRole, switchRole, canSwitchRoles } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    bio: user?.bio || '',
    hostBio: user?.hostBio || '',
    hostExperience: user?.hostExperience || '',
    languages: user?.languages || [],
    hostingStyle: user?.hostingStyle || '',
    responseTime: user?.responseTime || '',
  });
  const [formErrors, setFormErrors] = useState({});

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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      bio: user?.bio || '',
      hostBio: user?.hostBio || '',
      hostExperience: user?.hostExperience || '',
      languages: user?.languages || [],
      hostingStyle: user?.hostingStyle || '',
      responseTime: user?.responseTime || '',
    });
    setFormErrors({});
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  const renderGuestProfile = () => (
    <div className="space-y-6">
      {/* Guest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 mr-3" />
            <div>
              <p className="text-blue-100">Trips Completed</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center">
            <Star className="w-8 h-8 mr-3" />
            <div>
              <p className="text-green-100">Average Rating</p>
              <p className="text-2xl font-bold">4.9</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center">
            <Award className="w-8 h-8 mr-3" />
            <div>
              <p className="text-purple-100">Member Since</p>
              <p className="text-xl font-bold">2023</p>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Bio */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
        {isEditing ? (
          <div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Tell other hosts about yourself..."
            />
          </div>
        ) : (
          <p className="text-gray-600">
            {user.bio || 'No bio added yet. Tell other hosts about yourself!'}
          </p>
        )}
      </div>

      {/* Guest Preferences */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Travel Style</p>
              <p className="text-sm text-gray-600">Adventure Seeker</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Favorite Destinations</p>
              <p className="text-sm text-gray-600">Beaches, Mountains</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews as Guest */}     
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews from Hosts</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-gray-600 italic">"Great guest! Very respectful and clean. Would host again!"</p>
            <p className="text-sm text-gray-500 mt-2">- Sarah from Tokyo • Oct 2024</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-gray-600 italic">"Excellent communication and followed all house rules perfectly."</p>
            <p className="text-sm text-gray-500 mt-2">- Mike from London • Sep 2024</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHostProfile = () => (
    <div className="space-y-6">
      {/* Host Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg text-white">
          <div className="flex items-center">
            <Home className="w-8 h-8 mr-3" />
            <div>
              <p className="text-red-100">Properties</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 mr-3" />
            <div>
              <p className="text-green-100">Total Bookings</p>
              <p className="text-2xl font-bold">124</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
          <div className="flex items-center">
            <Star className="w-8 h-8 mr-3" />
            <div>
              <p className="text-yellow-100">Host Rating</p>
              <p className="text-2xl font-bold">4.8</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center">
            <Shield className="w-8 h-8 mr-3" />
            <div>
              <p className="text-purple-100">Superhost</p>
              <p className="text-xl font-bold">Yes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Host Bio */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Host Bio</h3>
        {isEditing ? (
          <div>
            <textarea
              name="hostBio"
              value={formData.hostBio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Tell guests about yourself as a host..."
            />
          </div>
        ) : (
          <p className="text-gray-600">
            {user.hostBio || 'Add a bio to help guests get to know you better!'}
          </p>
        )}
      </div>

      {/* Host Experience & Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hosting Experience</h3>
          {isEditing ? (
            <select
              name="hostExperience"
              value={formData.hostExperience}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select experience level</option>
              <option value="new">New Host (Less than 1 year)</option>
              <option value="experienced">Experienced (1-3 years)</option>
              <option value="veteran">Veteran Host (3+ years)</option>
            </select>
          ) : (
            <p className="text-gray-600">
              {user.hostExperience || 'Not specified'}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hosting Style</h3>
          {isEditing ? (
            <select
              name="hostingStyle"
              value={formData.hostingStyle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select hosting style</option>
              <option value="hands-on">Hands-on (Love to interact)</option>
              <option value="balanced">Balanced (Available when needed)</option>
              <option value="independent">Independent (Let guests explore)</option>
            </select>
          ) : (
            <p className="text-gray-600">
              {user.hostingStyle || 'Not specified'}
            </p>
          )}
        </div>
      </div>

      {/* Response Time */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time</h3>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl font-bold text-green-600">
              {user.responseTime || '< 1h'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">Typically responds within an hour</p>
            <p className="text-sm text-gray-600">Fast response rate helps guests feel confident about booking</p>
          </div>
        </div>
      </div>

      {/* Reviews as Host */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews from Guests</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">5.0</span>
            </div>
            <p className="text-gray-600 italic">"Amazing host! The place was exactly as described and {user?.firstName} was very helpful throughout our stay."</p>
            <p className="text-sm text-gray-500 mt-2">- Jennifer from New York • Oct 2024</p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">5.0</span>
            </div>
            <p className="text-gray-600 italic">"Superb hospitality and great local recommendations. Highly recommend!"</p>
            <p className="text-sm text-gray-500 mt-2">- David from London • Sep 2024</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Profile Switcher */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <div className="flex items-center space-x-4">
                {/* Profile Toggle */}
                {canSwitchRoles && (
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => switchRole('guest')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentRole === 'guest'
                          ? 'bg-white text-red-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Users className="w-4 h-4 inline mr-2" />
                      Guest Profile
                    </button>
                    <button
                      onClick={() => switchRole('host')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentRole === 'host'
                          ? 'bg-white text-red-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Home className="w-4 h-4 inline mr-2" />
                      Host Profile
                    </button>
                  </div>
                )}
                
                {/* Edit Button */}
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Header */}
          <div className="px-6 py-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-900 mr-3">
                    {user.firstName} {user.lastName}
                  </h2>
                  {currentRole === 'host' && user.isHost && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Superhost
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                  {currentRole === 'host' && user.isHost && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Hosting since 2023</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">{user.firstName}</p>
                )}
                {formErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">{user.lastName}</p>
                )}
                {formErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
                    {user.phone || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
                    {user.dateOfBirth 
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : 'Not provided'
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Profile Content */}
        {!user.isHost ? (
          renderGuestProfile()
        ) : (
          currentRole === 'guest' ? renderGuestProfile() : renderHostProfile()
        )}
      </div>
    </div>
  );
};

export default ProfileSwitcher;