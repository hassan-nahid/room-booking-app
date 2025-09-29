import Stripe from 'stripe';

let stripe = null;

// Lazy initialization of Stripe
const getStripe = () => {
  if (!stripe) {
    // Check if Stripe secret key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is not defined in environment variables');
      console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('STRIPE')));
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }

    // Check if it's a test key or placeholder
    if (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') || process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
      console.log('✅ Stripe key format looks valid');
    } else {
      console.warn('⚠️  Stripe key format may be invalid (should start with sk_test_ or sk_live_)');
    }

    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Stripe initialized successfully');
  }
  return stripe;
};

/**
 * Create a payment intent for booking
 * @param {number} amount - Amount in cents
 * @param {string} currency - Currency code (default: usd)
 * @param {object} metadata - Additional metadata for the payment
 * @returns {Promise<object>} Payment intent object
 */
export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Confirm a payment intent
 * @param {string} paymentIntentId - Payment intent ID
 * @returns {Promise<object>} Confirmation result
 */
export const confirmPaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);
    
    return {
      success: true,
      status: paymentIntent.status,
      paymentIntent,
    };
  } catch (error) {
    console.error('Stripe payment confirmation error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Create a refund for a payment
 * @param {string} paymentIntentId - Payment intent ID to refund
 * @param {number} amount - Amount to refund in cents (optional, full refund if not provided)
 * @param {string} reason - Reason for refund
 * @returns {Promise<object>} Refund result
 */
export const createRefund = async (paymentIntentId, amount = null, reason = 'requested_by_customer') => {
  try {
    const refundData = {
      payment_intent: paymentIntentId,
      reason,
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100);
    }

    const refund = await getStripe().refunds.create(refundData);

    return {
      success: true,
      refund,
    };
  } catch (error) {
    console.error('Stripe refund creation error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Calculate booking total with fees
 * @param {number} pricePerNight - Property price per night
 * @param {number} nights - Number of nights
 * @param {number} cleaningFee - Cleaning fee (default: 0)
 * @param {number} serviceFee - Service fee percentage (default: 0.03 = 3%)
 * @param {number} taxRate - Tax rate percentage (default: 0.10 = 10%)
 * @returns {object} Breakdown of costs
 */
export const calculateBookingTotal = (
  pricePerNight, 
  nights, 
  cleaningFee = 0, 
  serviceFee = 0.03, 
  taxRate = 0.10
) => {
  const subtotal = pricePerNight * nights;
  const serviceAmount = subtotal * serviceFee;
  const taxAmount = (subtotal + serviceAmount + cleaningFee) * taxRate;
  const total = subtotal + cleaningFee + serviceAmount + taxAmount;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    cleaningFee: parseFloat(cleaningFee.toFixed(2)),
    serviceFee: parseFloat(serviceAmount.toFixed(2)),
    tax: parseFloat(taxAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    breakdown: {
      pricePerNight,
      nights,
      serviceFeeRate: serviceFee,
      taxRate,
    }
  };
};

export default {
  createPaymentIntent,
  confirmPaymentIntent,
  createRefund,
  calculateBookingTotal,
};