import axios from 'axios';

// Create axios instance for property API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const propertyApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
propertyApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
propertyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const propertyService = {
  // Get all properties (public)
  getAllProperties: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await propertyApi.get(`/properties${queryParams ? `?${queryParams}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch properties' };
    }
  },

  // Get property by ID
  getPropertyById: async (propertyId) => {
    try {
      const response = await propertyApi.get(`/properties/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch property' };
    }
  },

  // Alias for getPropertyById (for consistency)
  getProperty: async (propertyId) => {
    try {
      const response = await propertyApi.get(`/properties/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch property' };
    }
  },

  // Get current user's properties
  getHostProperties: async () => {
    try {
      const response = await propertyApi.get('/properties/my-properties');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch host properties' };
    }
  },

  // Get properties by specific host ID
  getPropertiesByHost: async (hostId) => {
    try {
      const response = await propertyApi.get(`/properties/host/${hostId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch host properties' };
    }
  },

  // Create new property
  createProperty: async (propertyData) => {
    try {
      const response = await propertyApi.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create property' };
    }
  },

  // Update property
  updateProperty: async (propertyId, propertyData) => {
    try {
      const response = await propertyApi.put(`/properties/${propertyId}`, propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update property' };
    }
  },

  // Delete property
  deleteProperty: async (propertyId) => {
    try {
      const response = await propertyApi.delete(`/properties/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete property' };
    }
  },

  // Upload property images
  uploadPropertyImages: async (propertyId, images) => {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await propertyApi.post(`/properties/${propertyId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload images' };
    }
  },

  // Delete property image
  deletePropertyImage: async (propertyId, imageId) => {
    try {
      const response = await propertyApi.delete(`/properties/${propertyId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete image' };
    }
  },

  // Update property availability
  updateAvailability: async (propertyId, availabilityData) => {
    try {
      const response = await propertyApi.put(`/properties/${propertyId}/availability`, availabilityData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update availability' };
    }
  },

  // Get property bookings (for hosts)
  getPropertyBookings: async (propertyId) => {
    try {
      const response = await propertyApi.get(`/properties/${propertyId}/bookings`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch property bookings' };
    }
  }
};

export default propertyService;