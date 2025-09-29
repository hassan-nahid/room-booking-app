import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Calculate booking price
 * @param {object} bookingData - Booking details
 * @returns {Promise} API response
 */
export const calculateBookingPrice = async (bookingData) => {
  try {
    const response = await api.post('/payments/calculate', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to calculate price' };
  }
};

/**
 * Create payment intent
 * @param {object} bookingData - Booking details
 * @returns {Promise} API response with client secret
 */
export const createPaymentIntent = async (bookingData) => {
  try {
    const response = await api.post('/payments/create-intent', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to create payment intent' };
  }
};

/**
 * Confirm payment and create booking
 * @param {object} paymentData - Payment confirmation data
 * @returns {Promise} API response
 */
export const confirmPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/confirm', paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to confirm payment' };
  }
};

/**
 * Create refund
 * @param {object} refundData - Refund details
 * @returns {Promise} API response
 */
export const createRefund = async (refundData) => {
  try {
    const response = await api.post('/payments/refund', refundData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to create refund' };
  }
};

/**
 * Get booking details
 * @param {string} bookingId - Booking ID
 * @returns {Promise} API response
 */
export const getBookingDetails = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to get booking details' };
  }
};

export default {
  calculateBookingPrice,
  createPaymentIntent,
  confirmPayment,
  createRefund,
  getBookingDetails,
};