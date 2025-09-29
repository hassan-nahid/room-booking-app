import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = localStorage.getItem('authToken')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // logout or redirect to login
    }
    return Promise.reject(error)
  }
)

// Properties API functions
export const propertiesApi = {
  // Get all properties
  getAll: async (params = {}) => {
    const response = await api.get('/properties', { params })
    return response.data
  },

  // Get single property by ID
  getById: async (id) => {
    const response = await api.get(`/properties/${id}`)
    return response.data
  },

  // Search properties
  search: async (searchParams) => {
    const response = await api.get('/properties/search', { params: searchParams })
    return response.data
  },
}

// Bookings API functions
export const bookingsApi = {
  // Get user's trips (as guest)
  getUserTrips: async (params = {}) => {
    const token = localStorage.getItem('token')
    const response = await api.get('/bookings/my-bookings', { 
      params: { type: 'guest', ...params },
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  // Get host's bookings
  getHostBookings: async (params = {}) => {
    const token = localStorage.getItem('token')
    const response = await api.get('/bookings/my-bookings', { 
      params: { type: 'host', ...params },
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  // Get single booking by ID
  getById: async (id) => {
    const token = localStorage.getItem('token')
    const response = await api.get(`/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  // Update booking status
  updateBooking: async (id, updateData) => {
    const token = localStorage.getItem('token')
    const response = await api.put(`/bookings/${id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const token = localStorage.getItem('token')
    const response = await api.delete(`/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}

export default api