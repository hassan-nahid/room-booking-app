import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard.jsx';
import { useNavigate, useLocation } from 'react-router';
import { MapPin, Calendar, Star, Eye, Edit, Trash2, Plus, AlertCircle, CheckCircle, X } from 'lucide-react';
import propertyService from '../../services/propertyService';

const Properties = () => {
  const { user } = useAuth();
  const { currentRole } = useDashboard();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, property: null });
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch host properties
  useEffect(() => {
    console.log('Properties useEffect - currentRole:', currentRole, 'user?.isHost:', user?.isHost, 'user:', user);
    
    if (currentRole === 'host') {
      fetchProperties();
    } else {
      console.log('Not fetching properties - currentRole is not host');
      setProperties([]);
      setLoading(false);
    }
    
    // Show success message if redirected from create page
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(''), 5000);
      window.history.replaceState({}, document.title);
    }
  }, [currentRole, user, location.state]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if user has authentication token
      const token = localStorage.getItem('token');
      console.log('Auth token present:', !!token);
      
      const response = await propertyService.getHostProperties();
      console.log('Properties API response:', response);
      
      // Response structure: { success: true, data: [...properties], pagination: {...} }
      const properties = response.data || [];
      console.log('Properties array:', properties);
      setProperties(properties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      
      // More specific error messages
      if (err.status === 401) {
        setError('Authentication required. Please log in again.');
      } else if (err.status === 403) {
        setError('Access denied. Host privileges required.');
      } else {
        setError(err.message || 'Failed to fetch properties');
      }
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      await propertyService.deleteProperty(propertyId);
      setProperties(prev => prev.filter(p => p._id !== propertyId));
      setDeleteModal({ show: false, property: null });
      setSuccessMessage('Property deleted successfully');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to delete property');
      setDeleteModal({ show: false, property: null });
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Guest view for non-hosts
  if (!user?.isHost && currentRole === 'guest') {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties</h3>
            <p className="text-gray-600 mb-6">
              Save properties you're interested in to see them here
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Browse Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentRole === 'host' ? 'My Properties' : 'Wishlist'}
            </h1>
            <p className="text-gray-600">
              {currentRole === 'host' 
                ? 'Manage your property listings' 
                : 'Properties you\'ve saved'
              }
            </p>
          </div>
          {currentRole === 'host' && (
            <button 
              onClick={() => navigate('/dashboard/properties/create')}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Property
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading properties...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && currentRole === 'host' && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-6">
              Start earning by listing your first property
            </p>
            <button 
              onClick={() => navigate('/dashboard/properties/create')}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Create Your First Property
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <MapPin className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {property.status || 'draft'}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {property.title}
                    </h3>
                    <div className="flex items-center ml-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {property.rating || '0.0'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm truncate">
                      {property.location?.city && property.location?.country 
                        ? `${property.location.city}, ${property.location.country}`
                        : 'Location not specified'
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{property.totalBookings || 0} bookings</span>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {formatPrice(property.pricePerNight)}/night
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => navigate(`/property/${property._id}`)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </button>
                    {currentRole === 'host' && (
                      <>
                        <button 
                          onClick={() => navigate(`/dashboard/properties/edit/${property._id}`)}
                          className="flex-1 px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 flex items-center justify-center"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button 
                          onClick={() => setDeleteModal({ show: true, property })}
                          className="px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Property</h3>
                <button
                  onClick={() => setDeleteModal({ show: false, property: null })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{deleteModal.property?.title}"? 
                This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteModal({ show: false, property: null })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProperty(deleteModal.property._id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;