import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { 
  X, 
  CreditCard, 
  Lock, 
  AlertCircle, 
  CheckCircle,
  Loader
} from 'lucide-react';
import { createPaymentIntent, confirmPayment } from '../services/paymentService';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const CheckoutForm = ({ 
  bookingData, 
  pricing, 
  property, 
  onSuccess, 
  onError, 
  onClose 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [specialRequests, setSpecialRequests] = useState('');



  useEffect(() => {
    // Create payment intent when component mounts
    const initializePayment = async () => {
      try {
        const response = await createPaymentIntent(bookingData);
        
        if (response.success) {
          setClientSecret(response.data.clientSecret);
        } else {
          setError(response.message || 'Failed to initialize payment');
        }
      } catch (err) {
        setError(err.message || 'Failed to initialize payment');
      }
    };

    initializePayment();
  }, [bookingData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    // Confirm payment with Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${guestDetails.firstName} ${guestDetails.lastName}`,
            email: guestDetails.email,
          },
        },
      }
    );

    if (stripeError) {
      setError(stripeError.message);
      setIsProcessing(false);
      return;
    }

    // Confirm payment with our backend
    try {
      const response = await confirmPayment({
        paymentIntentId: paymentIntent.id,
        guestDetails,
        specialRequests
      });

      if (response.success) {
        onSuccess(response.data.booking);
      } else {
        setError(response.message || 'Payment confirmation failed');
      }
    } catch (err) {
      setError(err.message || 'Payment confirmation failed');
    }

    setIsProcessing(false);
  };

  const handleGuestDetailsChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guest Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Guest Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={guestDetails.firstName}
              onChange={handleGuestDetailsChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="John"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={guestDetails.lastName}
              onChange={handleGuestDetailsChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={guestDetails.email}
            onChange={handleGuestDetailsChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={guestDetails.phone}
            onChange={handleGuestDetailsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Any special requests or notes for the host..."
          />
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Payment Information
        </h3>
        
        <div className="p-4 border border-gray-300 rounded-lg">
          <CardElement options={cardElementOptions} />
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Lock className="w-4 h-4 mr-2" />
          Your payment information is secure and encrypted
        </div>
      </div>

      {/* Price Breakdown */}
      {pricing && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h4 className="font-semibold text-gray-900">Price Details</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>${pricing.breakdown?.pricePerNight || 0} × {pricing.breakdown?.nights || 0} nights</span>
              <span>${pricing.subtotal || 0}</span>
            </div>
            {pricing.cleaningFee > 0 && (
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>${pricing.cleaningFee}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>${pricing.serviceFee || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${pricing.tax || 0}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${pricing.total || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 mr-2" />
            Confirm and Pay ${pricing?.total || '0'}
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By confirming your booking, you agree to our terms of service and privacy policy.
      </p>
    </form>
  );
};

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  bookingData, 
  pricing, 
  property,
  onSuccess 
}) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleSuccess = (booking) => {
    setBookingDetails(booking);
    setPaymentSuccess(true);
    setTimeout(() => {
      onSuccess(booking);
      onClose();
    }, 3000);
  };

  const handleError = (error) => {
    console.error('Payment error:', error);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 p-12">
            <h2 className="text-2xl font-bold text-gray-900">
              {paymentSuccess ? 'Booking Confirmed!' : 'Complete Your Booking'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {paymentSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-4">
                Your booking has been confirmed and you'll receive a confirmation email shortly.
              </p>
              {bookingDetails && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    Booking ID: {bookingDetails.id}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                bookingData={bookingData}
                pricing={pricing}
                property={property}
                onSuccess={handleSuccess}
                onError={handleError}
                onClose={onClose}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;