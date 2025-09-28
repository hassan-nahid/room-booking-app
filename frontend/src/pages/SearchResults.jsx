import { useSearchParams } from "react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import { usePropertySearch } from "../hooks/useProperties";
import PropertyCard from "../components/PropertyCard";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';
import { Map, List, Filter, SlidersHorizontal, X, Check } from "lucide-react";

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom price marker
const createPriceMarker = (price, isHovered = false) => {
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div class="${
        isHovered 
          ? 'bg-gray-900 text-white scale-110 shadow-xl' 
          : 'bg-white text-gray-900 hover:bg-gray-900 hover:text-white hover:scale-110 shadow-lg'
      } px-2 py-1 rounded-full border-2 border-white text-sm font-semibold transition-all duration-200 cursor-pointer">
        $${price}
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 15],
    popupAnchor: [0, -15]
  });
};

// Component to handle map bounds fitting
const MapBounds = ({ properties }) => {
  const map = useMap();
  
  useEffect(() => {
    if (properties.length > 0) {
      const validProperties = properties.filter(p => p.coordinates);
      
      if (validProperties.length === 1) {
        // Single property - center on it with appropriate zoom
        const { latitude, longitude } = validProperties[0].coordinates;
        map.setView([latitude, longitude], 14);
      } else if (validProperties.length > 1) {
        // Multiple properties - fit bounds to show all
        const bounds = validProperties.map(p => [
          p.coordinates.latitude, 
          p.coordinates.longitude
        ]);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [map, properties]);
  
  return null;
};

const transformPropertyData = (apiProperty) => {
  return {
    id: apiProperty._id,
    images: apiProperty.images || [],
    title: apiProperty.title,
    location: `${apiProperty.address?.city || 'Unknown'}, ${apiProperty.address?.country || 'Unknown'}`,
    price: apiProperty.pricePerNight,
    rating: apiProperty.rating || 0,
    nights: apiProperty.minimumStay || 1,
    isGuestFavorite: apiProperty.isGuestFavorite || false,
    coordinates: apiProperty.address?.coordinates,
    // Additional data
    propertyType: apiProperty.propertyType,
    category: apiProperty.category,
    maxGuests: apiProperty.maxGuests,
    bedrooms: apiProperty.bedrooms,
    bathrooms: apiProperty.bathrooms,
    amenities: apiProperty.amenities || [],
    instantBook: apiProperty.instantBook || false,
  };
};

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    instantBook: false,
    sortBy: 'relevance'
  });
  
  // Filter functions
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const toggleAmenity = (amenityId) => {
    setFilters(prev => {
      const newAmenities = prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId];
      
      console.log('Amenities updated:', newAmenities);
      
      return {
        ...prev,
        amenities: newAmenities
      };
    });
  };
  
  const clearAllFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      instantBook: false,
      sortBy: 'relevance'
    });
  };
  
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.propertyType) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.instantBook) count++;
    if (filters.sortBy !== 'relevance') count++;
    return count;
  };
  const mapRef = useRef(null);

  // Extract search parameters and merge with filters
  const searchCriteria = useMemo(() => ({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: searchParams.get('guests') || '',
    // Include filter parameters
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    propertyType: filters.propertyType,
    bedrooms: filters.bedrooms,
    bathrooms: filters.bathrooms,
    amenities: filters.amenities.length > 0 ? filters.amenities.join(',') : '',
    instantBook: filters.instantBook,
    sortBy: filters.sortBy
  }), [searchParams, filters]);

  // Debug: Log when filters change
  useEffect(() => {
    console.log('Filters updated:', filters);
  }, [filters]);

  // Use the search hook from your existing hooks
  const { data: searchResponse, isLoading, error } = usePropertySearch(
    searchCriteria,
    Object.keys(searchCriteria).some(key => searchCriteria[key])
  );

  // Transform and filter properties
  const properties = useMemo(() => {
    // Transform properties first
    const allProperties = searchResponse?.data ? searchResponse.data.map(transformPropertyData) : [];
    let filtered = [...allProperties];
    
    // Price filtering
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
    }
    
    // Property type filtering
    if (filters.propertyType) {
      filtered = filtered.filter(p => p.propertyType?.toLowerCase() === filters.propertyType.toLowerCase());
    }
    
    // Bedroom filtering
    if (filters.bedrooms) {
      filtered = filtered.filter(p => p.bedrooms >= parseInt(filters.bedrooms));
    }
    
    // Bathroom filtering
    if (filters.bathrooms) {
      filtered = filtered.filter(p => p.bathrooms >= parseInt(filters.bathrooms));
    }
    
    // Amenities filtering
    if (filters.amenities.length > 0) {
      console.log('Filtering by amenities:', filters.amenities);
      console.log('Sample property amenities:', filtered[0]?.amenities);
      
      filtered = filtered.filter(p => 
        filters.amenities.every(amenity => 
          p.amenities?.some(propAmenity => 
            propAmenity.toLowerCase() === amenity.toLowerCase() ||
            propAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      );
      
      console.log('Properties after amenity filtering:', filtered.length);
    }
    
    // Instant book filtering
    if (filters.instantBook) {
      filtered = filtered.filter(p => p.instantBook === true);
    }
    
    // Sorting
    if (filters.sortBy && filters.sortBy !== 'relevance') {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_low_to_high':
            return a.price - b.price;
          case 'price_high_to_low':
            return b.price - a.price;
          case 'guest_favorite':
            return (b.isGuestFavorite ? 1 : 0) - (a.isGuestFavorite ? 1 : 0);
          default:
            return 0;
        }
      });
    }
    
    return filtered;
  }, [searchResponse?.data, filters]);

  // Calculate map center based on properties
  const getMapCenter = () => {
    const validProperties = properties.filter(p => p.coordinates);
    
    if (validProperties.length === 0) {
      return [23.8103, 90.4125]; // Default to Dhaka, Bangladesh
    }
    
    if (validProperties.length === 1) {
      const { latitude, longitude } = validProperties[0].coordinates;
      return [latitude, longitude];
    }
    
    // Calculate center point for multiple properties
    const avgLat = validProperties.reduce((sum, p) => sum + p.coordinates.latitude, 0) / validProperties.length;
    const avgLng = validProperties.reduce((sum, p) => sum + p.coordinates.longitude, 0) / validProperties.length;
    return [avgLat, avgLng];
  };
  
  const mapCenter = getMapCenter();

  const formatSearchSummary = () => {
    const parts = [];
    if (searchCriteria.location) parts.push(searchCriteria.location);
    if (searchCriteria.checkIn && searchCriteria.checkOut) {
      const checkIn = new Date(searchCriteria.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const checkOut = new Date(searchCriteria.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      parts.push(`${checkIn} - ${checkOut}`);
    }
    if (searchCriteria.guests) parts.push(`${searchCriteria.guests} guests`);
    return parts.join(' • ');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Results Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {properties.length} stays {searchCriteria.location && `in ${searchCriteria.location}`}
                {getActiveFilterCount() > 0 && (
                  <span className="ml-2 text-lg font-normal text-gray-600">
                    • {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} applied
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                {formatSearchSummary()}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map className="w-4 h-4 mr-2" />
                  Map
                </button>
              </div>

              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  showFilters || getActiveFilterCount() > 0
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                    showFilters || getActiveFilterCount() > 0
                      ? 'bg-white text-gray-900'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <div className="flex items-center space-x-3">
                {getActiveFilterCount() > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Clear all ({getActiveFilterCount()})
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Price per night</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min price</label>
                    <input
                      type="number"
                      placeholder="$0"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max price</label>
                    <input
                      type="number"
                      placeholder="$1000+"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Property type</h4>
                <select
                  value={filters.propertyType}
                  onChange={(e) => updateFilter('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Any type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="villa">Villa</option>
                  <option value="cabin">Cabin</option>
                  <option value="studio">Studio</option>
                </select>
              </div>

              {/* Rooms & Beds */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Rooms & beds</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Bedrooms</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => updateFilter('bedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Bathrooms</label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => updateFilter('bathrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Features</h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.instantBook}
                    onChange={(e) => updateFilter('instantBook', e.target.checked)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Instant Book</span>
                </label>
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Amenities</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {[
                  { id: 'wifi', name: 'Wifi', icon: '📶' },
                  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
                  { id: 'washer', name: 'Washer', icon: '🧺' },
                  { id: 'dryer', name: 'Dryer', icon: '🌀' },
                  { id: 'air_conditioning', name: 'AC', icon: '❄️' },
                  { id: 'heating', name: 'Heating', icon: '🔥' },
                  { id: 'pool', name: 'Pool', icon: '🏊' },
                  { id: 'hot_tub', name: 'Hot tub', icon: '🛁' },
                  { id: 'free_parking', name: 'Parking', icon: '🅿️' },
                  { id: 'gym', name: 'Gym', icon: '🏋️' },
                  { id: 'bbq_grill', name: 'BBQ', icon: '🔥' },
                  { id: 'breakfast', name: 'Breakfast', icon: '🍳' },
                  { id: 'beachfront', name: 'Beachfront', icon: '🏖️' },
                  { id: 'waterfront', name: 'Waterfront', icon: '🌊' },
                  { id: 'mountain_view', name: 'Mountain view', icon: '🏔️' },
                  { id: 'ocean_view', name: 'Ocean view', icon: '🌊' },
                  { id: 'lake_view', name: 'Lake view', icon: '🏞️' },
                  { id: 'dedicated_workspace', name: 'Workspace', icon: '�' }
                ].map((amenity) => (
                  <button
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center justify-center px-3 py-2 border rounded-lg text-sm transition-colors ${
                      filters.amenities.includes(amenity.id)
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    <span className="mr-1">{amenity.icon}</span>
                    <span className="truncate">{amenity.name}</span>
                    {filters.amenities.includes(amenity.id) && (
                      <Check className="w-3 h-3 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Sort by</h4>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="relevance">Recommended</option>
                <option value="price_low_to_high">Price: low to high</option>
                <option value="price_high_to_low">Price: high to low</option>
                <option value="guest_favorite">Guest favorite</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center min-h-[400px] flex-col">
            <div className="text-red-500 text-xl font-semibold mb-4">
              Failed to load search results
            </div>
            <div className="text-gray-600 mb-4">
              {error.message || 'Something went wrong. Please try again later.'}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Search Results Content */}
        {!isLoading && !error && (
          <>
            {/* Active Filters Display */}
            {getActiveFilterCount() > 0 && (
              <div className="mb-6">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filters.minPrice && (
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      Min: ${filters.minPrice}
                      <button onClick={() => updateFilter('minPrice', '')} className="ml-1 hover:text-gray-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.maxPrice && (
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      Max: ${filters.maxPrice}
                      <button onClick={() => updateFilter('maxPrice', '')} className="ml-1 hover:text-gray-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.propertyType && (
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      {filters.propertyType}
                      <button onClick={() => updateFilter('propertyType', '')} className="ml-1 hover:text-gray-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.amenities.map(amenityId => (
                    <span key={amenityId} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      {amenityId.replace('_', ' ')}
                      <button onClick={() => toggleAmenity(amenityId)} className="ml-1 hover:text-gray-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-gray-600 hover:text-gray-900 underline ml-2"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
            {viewMode === 'list' ? (
              // List View with Mini Map
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-gray-600">
                    Showing {properties.length} of {searchResponse?.pagination?.totalProperties || properties.length} properties
                  </div>
                  {properties.length > 0 && (
                    <button
                      onClick={() => setViewMode('map')}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      <Map className="w-4 h-4 mr-2" />
                      Show on map
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  {/* Property Grid */}
                  <div className="xl:col-span-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {properties.map((property) => (
                        <PropertyCard key={property.id} {...property} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Mini Map for desktop list view */}
                  {properties.length > 0 && (
                    <div className="hidden xl:block xl:col-span-1">
                      <div className="sticky top-32">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Map View</h3>
                          <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
                            <MapContainer
                              center={mapCenter}
                              zoom={properties.length === 1 ? 14 : 10}
                              scrollWheelZoom={false}
                              zoomControl={false}
                              className="h-full w-full"
                            >
                              <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              <MapBounds properties={properties} />
                              {properties.slice(0, 20).map((property) => 
                                property.coordinates && (
                                  <Marker
                                    key={property.id}
                                    position={[property.coordinates.latitude, property.coordinates.longitude]}
                                    icon={createPriceMarker(property.price, false)}
                                  />
                                )
                              )}
                            </MapContainer>
                          </div>
                          <button
                            onClick={() => setViewMode('map')}
                            className="w-full mt-3 bg-gray-900 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                          >
                            View full map
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Enhanced Map View
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
                {/* Property List */}
                <div className="overflow-y-auto">
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      {properties.length} properties found
                    </div>
                    {properties.map((property) => (
                      <div 
                        key={property.id} 
                        className={`flex bg-white border-2 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                          hoveredProperty === property.id 
                            ? 'border-gray-900 shadow-lg scale-[1.02]' 
                            : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                        }`}
                        onMouseEnter={() => setHoveredProperty(property.id)}
                        onMouseLeave={() => setHoveredProperty(null)}
                      >
                        <div className="w-1/3">
                          <img
                            src={property.images[0] || "/placeholder.svg"}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-4">
                              <h3 className="font-medium text-gray-900 truncate mb-1">{property.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                              <p className="text-xs text-gray-500 mb-2">
                                {property.maxGuests} guests • {property.bedrooms} bedrooms • {property.bathrooms} bathrooms
                              </p>
                              <div className="flex items-center text-xs text-gray-500">
                                <span>★</span>
                                <span className="ml-1">{property.rating || 'New'}</span>
                                {property.isGuestFavorite && (
                                  <span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                                    Guest favorite
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="mb-1">
                                <span className="text-lg font-semibold text-gray-900">${property.price}</span>
                                <span className="text-sm text-gray-500"> night</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Map */}
                <div className="bg-gray-100 rounded-lg overflow-hidden relative">
                  {properties.length > 0 && (
                    <div className="absolute top-4 left-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-md text-sm font-medium">
                      {properties.filter(p => p.coordinates).length} of {properties.length} properties shown on map
                    </div>
                  )}
                  
                  {properties.filter(p => !p.coordinates).length > 0 && (
                    <div className="absolute top-4 right-4 z-[1000] bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg shadow-md text-sm text-yellow-800">
                      {properties.filter(p => !p.coordinates).length} properties without location data
                    </div>
                  )}
                  
                  <MapContainer
                    ref={mapRef}
                    center={mapCenter}
                    zoom={properties.length === 1 ? 14 : 11}
                    scrollWheelZoom={true}
                    zoomControl={true}
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapBounds properties={properties} />
                    {properties.map((property) => 
                      property.coordinates && (
                        <Marker
                          key={property.id}
                          position={[property.coordinates.latitude, property.coordinates.longitude]}
                          icon={createPriceMarker(property.price, hoveredProperty === property.id)}
                          eventHandlers={{
                            mouseover: () => setHoveredProperty(property.id),
                            mouseout: () => setHoveredProperty(null),
                          }}
                        >
                          <Popup maxWidth={300} className="custom-popup">
                            <div className="p-2">
                              <div className="relative mb-3">
                                <img
                                  src={property.images[0] || "/placeholder.svg"}
                                  alt={property.title}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                {property.isGuestFavorite && (
                                  <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                                    Guest favourite
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight">{property.title}</h4>
                                <p className="text-xs text-gray-600">{property.location}</p>
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-gray-500">
                                    {property.maxGuests} guests • {property.bedrooms} bed • {property.bathrooms} bath
                                  </div>
                                  <div className="flex items-center text-xs">
                                    <span>★</span>
                                    <span className="ml-1">{property.rating || 'New'}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t">
                                  <div>
                                    <span className="text-lg font-bold text-gray-900">${property.price}</span>
                                    <span className="text-sm text-gray-500"> night</span>
                                  </div>
                                  <button className="bg-gray-900 text-white px-3 py-1 rounded-lg text-xs hover:bg-gray-800 transition-colors">
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      )
                    )}
                  </MapContainer>
                </div>
              </div>
            )}

            {/* Empty State */}
            {properties.length === 0 && (
              <div className="flex items-center justify-center min-h-[400px] flex-col">
                <div className="text-gray-500 text-xl font-semibold mb-4">
                  No properties found
                </div>
                <div className="text-gray-400 text-center max-w-md">
                  Try adjusting your search criteria or explore different destinations.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}