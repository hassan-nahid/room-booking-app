import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Home, 
  MapPin, 
  Upload, 
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
  Camera,
  Plus
} from 'lucide-react';
import propertyService from '../../services/propertyService';

const CreateProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    propertyType: '',
    category: '',
    
    // Address (required by backend)
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
    
    // Details
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    
    // Pricing
    pricePerNight: '',
    cleaningFee: '',
    securityDeposit: '',
    
    // Amenities
    amenities: [],
    
    // House Rules
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
    
    // Images
    images: [''] // Initialize with one empty URL field
  });

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: '🏢' },
    { value: 'house', label: 'House', icon: '🏠' },
    { value: 'villa', label: 'Villa', icon: '🏡' },
    { value: 'condo', label: 'Condo', icon: '🏘️' },
    { value: 'cabin', label: 'Cabin', icon: '🏕️' },
    { value: 'loft', label: 'Loft', icon: '🏭' },
    { value: 'studio', label: 'Studio', icon: '🏢' },
    { value: 'townhouse', label: 'Townhouse', icon: '🏘️' }
  ];

  const categories = [
    { value: 'entire_home', label: 'Entire Home/Apartment', icon: '�' },
    { value: 'private_room', label: 'Private Room', icon: '🚪' },
    { value: 'shared_room', label: 'Shared Room', icon: '👥' },
    { value: 'hotel_room', label: 'Hotel Room', icon: '�' },
    { value: 'historic', label: 'Historic', icon: '🏛️' }
  ];

  const amenitiesList = [
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };



  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Property title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
        if (!formData.category) newErrors.category = 'Category is required';
        break;
      
      case 2:
        if (!formData.address.street.trim()) newErrors['address.street'] = 'Street address is required';
        if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
        if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
        if (!formData.address.country.trim()) newErrors['address.country'] = 'Country is required';
        if (!formData.address.zipCode.trim()) newErrors['address.zipCode'] = 'ZIP code is required';
        break;
      
      case 3:
        if (formData.maxGuests < 1) newErrors.maxGuests = 'At least 1 guest required';
        if (formData.bedrooms < 0) newErrors.bedrooms = 'Bedrooms cannot be negative';
        if (formData.beds < 1) newErrors.beds = 'At least 1 bed required';
        if (formData.bathrooms < 0) newErrors.bathrooms = 'Bathrooms cannot be negative';
        break;
      
      case 4:
        if (!formData.pricePerNight || formData.pricePerNight < 1) {
          newErrors.pricePerNight = 'Valid price per night is required';
        }
        break;
      
      case 5:
        // Amenities step - no required validation, amenities are optional
        break;
      
      case 6: {
        const validImages = formData.images.filter(url => url.trim());
        if (validImages.length === 0) {
          newErrors.images = 'At least one image URL is required';
        }
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    
    try {
      // Filter out empty image URLs
      const validImages = formData.images.filter(url => url.trim());
      
      // Prepare form data for API
      const propertyPayload = {
        ...formData,
        images: validImages,
        // Ensure coordinates have values (required by backend)
        address: {
          ...formData.address,
          coordinates: {
            latitude: formData.address.coordinates.latitude || 0,
            longitude: formData.address.coordinates.longitude || 0
          }
        }
      };

      // Create property
      console.log('Creating property with payload:', propertyPayload);
      await propertyService.createProperty(propertyPayload);

      // Success - navigate to properties page
      navigate('/dashboard/properties', { 
        state: { message: 'Property created successfully!' } 
      });

    } catch (error) {
      console.error('Create property error:', error);
      setErrors({ 
        submit: error.message || 'Failed to create property. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
              <p className="text-gray-600">Tell us about your property</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. Beautiful Beachfront Villa"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your property, its features, and what makes it special..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {propertyTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, propertyType: type.value }))}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      formData.propertyType === type.value
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
              {errors.propertyType && <p className="mt-1 text-sm text-red-600">{errors.propertyType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      formData.category === category.value
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </button>
                ))}
              </div>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Location</h2>
              <p className="text-gray-600">Where is your property located?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors['address.street'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123 Main Street"
              />
              {errors['address.street'] && <p className="mt-1 text-sm text-red-600">{errors['address.street']}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors['address.city'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Dhaka"
                />
                {errors['address.city'] && <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Region *
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors['address.state'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Dhaka Division"
                />
                {errors['address.state'] && <p className="mt-1 text-sm text-red-600">{errors['address.state']}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors['address.country'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Bangladesh"
                />
                {errors['address.country'] && <p className="mt-1 text-sm text-red-600">{errors['address.country']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors['address.zipCode'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1000"
                />
                {errors['address.zipCode'] && <p className="mt-1 text-sm text-red-600">{errors['address.zipCode']}</p>}
              </div>
            </div>

            {/* Map Coordinates */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Location Coordinates</h3>
                <button
                  type="button"
                  onClick={() => {
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
                          alert('Unable to get your location. Please enter coordinates manually.');
                        }
                      );
                    } else {
                      alert('Geolocation is not supported by this browser.');
                    }
                  }}
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
                    onChange={handleInputChange}
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="23.8103"
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
                    onChange={handleInputChange}
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="90.4125"
                    required
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                💡 Tip: Click "Get Current Location" to automatically fill coordinates, or enter them manually. You can also find coordinates on Google Maps.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Details</h2>
              <p className="text-gray-600">Tell us about the space</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Guests *
                </label>
                <input
                  type="number"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  min="1"
                  max="20"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.maxGuests ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.maxGuests && <p className="mt-1 text-sm text-red-600">{errors.maxGuests}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.bedrooms ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  step="0.5"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.bathrooms ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beds *
                </label>
                <input
                  type="number"
                  name="beds"
                  value={formData.beds}
                  onChange={handleInputChange}
                  min="1"
                  max="20"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.beds ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.beds && <p className="mt-1 text-sm text-red-600">{errors.beds}</p>}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing</h2>
              <p className="text-gray-600">Set your pricing structure</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Night (USD) *
              </label>
              <input
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleInputChange}
                min="1"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.pricePerNight ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="50.00"
              />
              {errors.pricePerNight && <p className="mt-1 text-sm text-red-600">{errors.pricePerNight}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cleaning Fee (USD)
                </label>
                <input
                  type="number"
                  name="cleaningFee"
                  value={formData.cleaningFee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="15.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Deposit (USD)
                </label>
                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="100.00"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Amenities</h2>
              <p className="text-gray-600">What amenities do you offer?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenitiesList.map((amenity) => {
                const IconComponent = amenity.icon;
                const isSelected = formData.amenities.includes(amenity.id);
                
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <IconComponent className="w-6 h-6 mb-2" />
                    <div className="text-sm font-medium">{amenity.label}</div>
                  </button>
                );
              })}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">House Rules</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    name="houseRules.checkInTime"
                    value={formData.houseRules.checkInTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    name="houseRules.checkOutTime"
                    value={formData.houseRules.checkOutTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stay (nights)
                  </label>
                  <input
                    type="number"
                    name="houseRules.minimumStay"
                    value={formData.houseRules.minimumStay}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Stay (nights)
                  </label>
                  <input
                    type="number"
                    name="houseRules.maximumStay"
                    value={formData.houseRules.maximumStay}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="houseRules.smokingAllowed"
                    checked={formData.houseRules.smokingAllowed}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Smoking allowed</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="houseRules.petsAllowed"
                    checked={formData.houseRules.petsAllowed}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Pets allowed</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="houseRules.partiesAllowed"
                    checked={formData.houseRules.partiesAllowed}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Parties/events allowed</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="houseRules.childrenAllowed"
                    checked={formData.houseRules.childrenAllowed}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Children allowed</label>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Photos</h2>
              <p className="text-gray-600">Add photo URLs of your property (at least 1 required)</p>
            </div>

            <div className="space-y-4">
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[index] = e.target.value;
                      setFormData(prev => ({ ...prev, images: newImages }));
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, images: newImages }));
                    }}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ 
                    ...prev, 
                    images: [...prev.images, ''] 
                  }));
                }}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Image URL
              </button>
              
              {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
            </div>

            {formData.images.some(url => url.trim()) && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Preview Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.filter(url => url.trim()).map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/properties')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Properties
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Create New Property</h1>
          <p className="text-gray-600 mt-2">List your space and start earning</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step < currentStep 
                    ? 'bg-green-500 text-white' 
                    : step === currentStep 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 6 && (
                  <div className={`w-full h-1 mx-2 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Basic Info</span>
            <span>Location</span>
            <span>Details</span>
            <span>Pricing</span>
            <span>Amenities</span>
            <span>Photos</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {errors.submit && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {errors.submit}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Property...' : 'Create Property'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProperty;