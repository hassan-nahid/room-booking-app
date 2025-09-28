import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Save, 
  Loader, 
  AlertCircle, 
  CheckCircle, 
  MapPin,
  Plus,
  X,
  Wifi,
  Car,
  Tv,
  Coffee,
  Waves,
  Dumbbell,
  Utensils,
  Snowflake,
  Shirt,
  Shield,
  Home
} from 'lucide-react';
import propertyService from '../../services/propertyService';

const UpdateProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    category: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      coordinates: {
        latitude: null,
        longitude: null
      }
    },
    pricePerNight: '',
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: [],
    houseRules: {
      checkInTime: '15:00',
      checkOutTime: '11:00',
      minimumStay: 1,
      maximumStay: 365,
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: false,
      childrenAllowed: true
    },
    cancellationPolicy: 'moderate',
    instantBook: false,
    images: [''],
    status: 'active'
  });

  const propertyTypes = [
    'apartment', 'house', 'condo', 'villa', 'cabin', 'studio', 'loft', 
    'townhouse', 'cottage', 'bungalow', 'castle', 'treehouse', 'boat', 
    'camper', 'tent', 'other'
  ];

  const categories = [
    'entire_home', 'private_room', 'shared_room', 'hotel_room'
  ];

  const availableAmenities = [
    // Essential amenities
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'kitchen', label: 'Kitchen', icon: Utensils },
    { id: 'washer', label: 'Washer', icon: Shirt },
    { id: 'dryer', label: 'Dryer', icon: Shirt },
    { id: 'air_conditioning', label: 'Air Conditioning', icon: Snowflake },
    { id: 'heating', label: 'Heating', icon: Snowflake },
    { id: 'dedicated_workspace', label: 'Dedicated Workspace', icon: Tv },
    { id: 'tv', label: 'TV', icon: Tv },
    { id: 'hair_dryer', label: 'Hair Dryer', icon: Shirt },
    { id: 'iron', label: 'Iron', icon: Shirt },
    
    // Features
    { id: 'pool', label: 'Pool', icon: Waves },
    { id: 'hot_tub', label: 'Hot Tub', icon: Waves },
    { id: 'free_parking', label: 'Free Parking', icon: Car },
    { id: 'ev_charger', label: 'EV Charger', icon: Car },
    { id: 'crib', label: 'Crib', icon: Shield },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'bbq_grill', label: 'BBQ Grill', icon: Utensils },
    { id: 'breakfast', label: 'Breakfast', icon: Coffee },
    { id: 'indoor_fireplace', label: 'Indoor Fireplace', icon: Shield },
    { id: 'smoking_allowed', label: 'Smoking Allowed', icon: Shield },
    
    // Location features
    { id: 'beachfront', label: 'Beachfront', icon: Waves },
    { id: 'waterfront', label: 'Waterfront', icon: Waves },
    { id: 'ski_in_out', label: 'Ski In/Out', icon: Shield },
    { id: 'mountain_view', label: 'Mountain View', icon: Shield },
    { id: 'ocean_view', label: 'Ocean View', icon: Waves },
    { id: 'lake_view', label: 'Lake View', icon: Waves },
    { id: 'city_skyline_view', label: 'City Skyline View', icon: Shield },
    { id: 'park_view', label: 'Park View', icon: Shield },
    { id: 'garden_view', label: 'Garden View', icon: Shield },
    
    // Safety features
    { id: 'smoke_alarm', label: 'Smoke Alarm', icon: Shield },
    { id: 'carbon_monoxide_alarm', label: 'Carbon Monoxide Alarm', icon: Shield },
    { id: 'first_aid_kit', label: 'First Aid Kit', icon: Shield },
    { id: 'fire_extinguisher', label: 'Fire Extinguisher', icon: Shield },
    { id: 'security_cameras', label: 'Security Cameras', icon: Shield },
    { id: 'lockbox', label: 'Lockbox', icon: Shield },
    { id: 'hangers', label: 'Hangers', icon: Shirt },
    { id: 'bed_linens', label: 'Bed Linens', icon: Shield },
    { id: 'extra_pillows', label: 'Extra Pillows', icon: Shield },
    
    // Accessibility
    { id: 'step_free_access', label: 'Step-Free Access', icon: Shield },
    { id: 'wide_entrance', label: 'Wide Entrance', icon: Shield },
    { id: 'accessible_parking', label: 'Accessible Parking', icon: Car },
    { id: 'elevator', label: 'Elevator', icon: Shield },
    { id: 'wide_hallways', label: 'Wide Hallways', icon: Shield },
    { id: 'accessible_bathroom', label: 'Accessible Bathroom', icon: Shield },
    { id: 'ceiling_hoist', label: 'Ceiling Hoist', icon: Shield },
    
    // Unique amenities
    { id: 'piano', label: 'Piano', icon: Shield },
    { id: 'pool_table', label: 'Pool Table', icon: Shield },
    { id: 'exercise_equipment', label: 'Exercise Equipment', icon: Dumbbell },
    { id: 'lake_access', label: 'Lake Access', icon: Waves },
    { id: 'beach_access', label: 'Beach Access', icon: Waves },
    { id: 'ski_equipment', label: 'Ski Equipment', icon: Shield },
    { id: 'kayak', label: 'Kayak', icon: Waves },
    { id: 'bikes', label: 'Bikes', icon: Shield },
    { id: 'hammock', label: 'Hammock', icon: Shield },
    { id: 'outdoor_shower', label: 'Outdoor Shower', icon: Waves }
  ];

//   const cancellationPolicies = [
//     { value: 'flexible', label: 'Flexible - Full refund 1 day prior to arrival' },
//     { value: 'moderate', label: 'Moderate - Full refund 5 days prior to arrival' },
//     { value: 'strict', label: 'Strict - 50% refund up until 1 week prior to arrival' }
//   ];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('Fetching property with ID:', id);
        
        const response = await propertyService.getProperty(id);
        console.log('API Response:', response);
        
        // Handle different response structures
        const property = response.data?.property || response.data || response;
        
        if (!property) {
          throw new Error('Property not found');
        }
        
        console.log('Property data:', property);
        
        setFormData({
          title: property.title || '',
          description: property.description || '',
          propertyType: property.propertyType || '',
          category: property.category || '',
          address: {
            street: property.address?.street || '',
            city: property.address?.city || '',
            state: property.address?.state || '',
            country: property.address?.country || '',
            zipCode: property.address?.zipCode || '',
            coordinates: {
              latitude: property.address?.coordinates?.latitude || null,
              longitude: property.address?.coordinates?.longitude || null
            }
          },
          pricePerNight: property.pricePerNight || '',
          maxGuests: property.maxGuests || 1,
          bedrooms: property.bedrooms || 1,
          beds: property.beds || 1,
          bathrooms: property.bathrooms || 1,
          amenities: property.amenities || [],
          houseRules: {
            checkInTime: property.houseRules?.checkInTime || '15:00',
            checkOutTime: property.houseRules?.checkOutTime || '11:00',
            minimumStay: property.houseRules?.minimumStay || 1,
            maximumStay: property.houseRules?.maximumStay || 365,
            smokingAllowed: property.houseRules?.smokingAllowed || false,
            petsAllowed: property.houseRules?.petsAllowed || false,
            partiesAllowed: property.houseRules?.partiesAllowed || false,
            childrenAllowed: property.houseRules?.childrenAllowed || true
          },
          cancellationPolicy: property.cancellationPolicy || 'moderate',
          instantBook: property.instantBook || false,
          images: property.images?.length > 0 ? property.images : [''],
          status: property.status || 'active'
        });
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.message || 'Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value
          }
        }));
      } else if (parent === 'houseRules') {
        setFormData(prev => ({
          ...prev,
          houseRules: {
            ...prev.houseRules,
            [child]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
      }));
    }
  };

  const handleCoordinatesChange = (e) => {
    const { name, value } = e.target;
    const coordinate = name.split('.')[2]; // address.coordinates.latitude or longitude
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        coordinates: {
          ...prev.address.coordinates,
          [coordinate]: value ? parseFloat(value) : null
        }
      }
    }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  // Get current location for coordinates
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enter coordinates manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleImageChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const moveImage = (fromIndex, toIndex) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const validateImageUrl = (url) => {
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
    return urlPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.propertyType || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!formData.address.coordinates.latitude || !formData.address.coordinates.longitude) {
      setError('Please provide property coordinates');
      return;
    }
    
    // Validate images
    const validImages = formData.images.filter(url => url.trim());
    if (validImages.length === 0) {
      setError('Please add at least one property image');
      return;
    }
    
    const invalidImages = validImages.filter(url => !validateImageUrl(url));
    if (invalidImages.length > 0) {
      setError('Please provide valid image URLs (jpg, jpeg, png, gif, webp)');
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      // Filter out empty image URLs
      const validImages = formData.images.filter(url => url.trim());
      
      // Prepare data for backend
      const updateData = {
        ...formData,
        images: validImages,
        // Ensure coordinates are numbers if provided
        address: {
          ...formData.address,
          coordinates: {
            latitude: formData.address.coordinates.latitude ? parseFloat(formData.address.coordinates.latitude) : 0,
            longitude: formData.address.coordinates.longitude ? parseFloat(formData.address.coordinates.longitude) : 0
          }
        }
      };
      
      console.log('Updating property with data:', updateData);
      await propertyService.updateProperty(id, updateData);
      
      setSuccess('Property updated successfully!');
      setTimeout(() => {
        navigate('/dashboard/properties', {
          state: { message: 'Property updated successfully!' }
        });
      }, 2000);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard/properties')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Update Property</h1>
              <p className="text-gray-600">Edit your property listing</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Amazing apartment in downtown"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select type</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>
                      {type && type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Describe your property..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="State or Province"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="ZIP or Postal Code"
                />
              </div>
            </div>

            {/* Coordinates */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Location Coordinates</h3>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Get Current Location
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    name="address.coordinates.latitude"
                    value={formData.address.coordinates.latitude || ''}
                    onChange={handleCoordinatesChange}
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="40.7128"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    name="address.coordinates.longitude"
                    value={formData.address.coordinates.longitude || ''}
                    onChange={handleCoordinatesChange}
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="-74.0060"
                    required
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                💡 Tip: Click "Get Current Location" to automatically fill coordinates, or enter them manually. You can also find coordinates on Google Maps.
              </p>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Guests
                </label>
                <input
                  type="number"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Night ($)
                </label>
                <input
                  type="number"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableAmenities.map((amenity) => {
                const IconComponent = amenity.icon;
                return (
                  <div
                    key={amenity.id}
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.amenities.includes(amenity.id)
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <IconComponent className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">{amenity.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Property Images */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h2>
            
            <div className="space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Image URL {index + 1} {index === 0 ? '(Main Photo) *' : ''}
                        </label>
                        <div className="flex space-x-1">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, index - 1)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Move up"
                            >
                              ↑
                            </button>
                          )}
                          {index < formData.images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, index + 1)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Move down"
                            >
                              ↓
                            </button>
                          )}
                        </div>
                      </div>
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          image && !validateImageUrl(image) 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="https://example.com/image.jpg"
                        required={index === 0}
                      />
                      {image && !validateImageUrl(image) && (
                        <p className="text-red-500 text-xs mt-1">
                          Please enter a valid image URL (jpg, jpeg, png, gif, webp)
                        </p>
                      )}
                    </div>
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove image"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  {/* Image Preview */}
                  {image && image.trim() && (
                    <div className="mt-2">
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                        onLoad={(e) => {
                          e.target.style.display = 'block';
                          e.target.nextSibling.style.display = 'none';
                        }}
                      />
                      <div 
                        className="w-32 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 text-sm"
                        style={{ display: 'none' }}
                      >
                        Invalid URL
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add More Images & Bulk Actions */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={formData.images.length >= 10}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Image
                  {formData.images.length >= 10 && (
                    <span className="ml-2 text-xs text-gray-400">(Max 10)</span>
                  )}
                </button>
                
                {formData.images.length > 1 && (
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        const emptyImages = formData.images.map(() => '');
                        setFormData(prev => ({ ...prev, images: emptyImages.length > 0 ? emptyImages : [''] }));
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear All URLs
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const nonEmptyImages = formData.images.filter(img => img.trim());
                        setFormData(prev => ({ 
                          ...prev, 
                          images: nonEmptyImages.length > 0 ? nonEmptyImages : [''] 
                        }));
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Remove Empty Fields
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="text-blue-500 mt-0.5">💡</div>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Image Guidelines:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-600">
                      <li>Add high-quality images to showcase your property ({formData.images.filter(img => img.trim()).length} of {formData.images.length} slots used)</li>
                      <li>The first image will be used as the main photo</li>
                      <li>Supported formats: JPG, JPEG, PNG, GIF, WebP</li>
                      <li>Use ↑↓ buttons to reorder images</li>
                      <li>Recommended: 5-10 images for best results</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/properties')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Property
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProperty;