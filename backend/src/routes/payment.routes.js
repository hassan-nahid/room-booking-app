import express from 'express';
import { createPaymentIntent, confirmPaymentIntent, createRefund, calculateBookingTotal } from '../services/stripe.service.js';
import { Property } from '../models/property.model.js';
import { Booking } from '../models/booking.model.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

// @desc    Calculate booking price
// @route   POST /api/payments/calculate
// @access  Private
router.post('/calculate', auth, async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, numberOfGuests } = req.body;

    // Validate required fields
    if (!propertyId || !checkIn || !checkOut || !numberOfGuests) {
      return res.status(400).json({
        success: false,
        message: 'Property ID, check-in, check-out dates and number of guests are required'
      });
    }

    // Get property details
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Calculate pricing
    const pricing = calculateBookingTotal(
      property.pricePerNight,
      nights,
      property.cleaningFee || 0
    );

    res.json({
      success: true,
      data: {
        property: {
          id: property._id,
          title: property.title,
          pricePerNight: property.pricePerNight,
          cleaningFee: property.cleaningFee || 0
        },
        booking: {
          checkIn,
          checkOut,
          nights,
          numberOfGuests
        },
        pricing
      }
    });
  } catch (error) {
    console.error('Price calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating booking price',
      error: error.message
    });
  }
});

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, numberOfGuests, guestDetails } = req.body;

    // Validate required fields
    if (!propertyId || !checkIn || !checkOut || !numberOfGuests) {
      return res.status(400).json({
        success: false,
        message: 'Property ID, check-in, check-out dates and number of guests are required'
      });
    }

    // Get property details
    const property = await Property.findById(propertyId).populate('host');
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check property availability
    if (!property.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for booking'
      });
    }

    // Check guest capacity
    if (numberOfGuests > property.maxGuests) {
      return res.status(400).json({
        success: false,
        message: `Property can accommodate maximum ${property.maxGuests} guests`
      });
    }

    // Calculate pricing
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    const pricing = calculateBookingTotal(
      property.pricePerNight,
      nights,
      property.cleaningFee || 0
    );

    // Create payment intent
    const paymentResult = await createPaymentIntent(
      pricing.total,
      'usd',
      {
        propertyId: property._id.toString(),
        propertyTitle: property.title,
        hostId: property.host._id.toString(),
        guestId: req.user.id,
        checkIn,
        checkOut,
        nights: nights.toString(),
        numberOfGuests: numberOfGuests.toString(),
        totalAmount: pricing.total.toString()
      }
    );

    if (!paymentResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment intent',
        error: paymentResult.error
      });
    }

    res.json({
      success: true,
      data: {
        clientSecret: paymentResult.clientSecret,
        paymentIntentId: paymentResult.paymentIntentId,
        property: {
          id: property._id,
          title: property.title,
          pricePerNight: property.pricePerNight,
          cleaningFee: property.cleaningFee || 0,
          host: {
            id: property.host._id,
            firstName: property.host.firstName,
            lastName: property.host.lastName
          }
        },
        booking: {
          checkIn,
          checkOut,
          nights,
          numberOfGuests
        },
        pricing
      }
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent',
      error: error.message
    });
  }
});

// @desc    Confirm payment and create booking
// @route   POST /api/payments/confirm
// @access  Private
router.post('/confirm', auth, async (req, res) => {
  try {
    const { paymentIntentId, guestDetails, specialRequests } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    // Confirm payment with Stripe
    const paymentResult = await confirmPaymentIntent(paymentIntentId);

    if (!paymentResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Payment confirmation failed',
        error: paymentResult.error
      });
    }

    // Check if payment was successful
    if (paymentResult.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment was not successful',
        status: paymentResult.status
      });
    }

    // Extract metadata from payment intent
    const metadata = paymentResult.paymentIntent.metadata;
    const property = await Property.findById(metadata.propertyId).populate('host');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Calculate pricing again for accuracy
    const nights = parseInt(metadata.nights);
    const pricing = calculateBookingTotal(
      property.pricePerNight,
      nights,
      property.cleaningFee || 0
    );

    // Create booking
    const bookingData = {
      property: metadata.propertyId,
      guest: req.user.id,
      host: metadata.hostId,
      checkIn: new Date(metadata.checkIn),
      checkOut: new Date(metadata.checkOut),
      numberOfGuests: parseInt(metadata.numberOfGuests),
      guestDetails: {
        adults: parseInt(metadata.numberOfGuests) || 1, // Fix: Add required adults field
        children: 0,
        infants: 0
      },
      numberOfNights: nights,
      pricePerNight: property.pricePerNight,
      subtotal: pricing.subtotal, // Fix: Add required subtotal field
      serviceFee: pricing.serviceFee,
      cleaningFee: pricing.cleaningFee,
      taxAmount: pricing.tax,
      totalAmount: pricing.total,
      currency: 'USD',
      status: 'confirmed', // Use 'status' instead of 'bookingStatus'
      paymentStatus: 'paid', // Fix: Use valid enum value 'paid' instead of 'completed'
      paymentMethod: 'stripe',
      stripePaymentIntentId: paymentIntentId,
      specialRequests: specialRequests || ''
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // Populate booking with property and user details for email
    await booking.populate([
      { path: 'property', select: 'title address images pricePerNight' },
      { path: 'guest', select: 'firstName lastName email phone' },
      { path: 'host', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully and payment confirmed',
      data: {
        booking: {
          id: booking._id,
          property: booking.property,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          numberOfGuests: booking.numberOfGuests,
          numberOfNights: booking.numberOfNights,
          totalAmount: booking.totalAmount,
          subtotal: booking.subtotal,
          serviceFee: booking.serviceFee,
          cleaningFee: booking.cleaningFee,
          taxAmount: booking.taxAmount,
          status: booking.status,
          paymentStatus: booking.paymentStatus
        }
      }
    });

    // Send confirmation emails (async, don't wait for response)
    const emailService = await import('../services/email.service.js');
    
    // Send confirmation email to guest
    emailService.sendBookingConfirmationEmail(
      booking,
      booking.property,
      booking.guest
    ).catch(err => console.error('Guest email error:', err));

    // Send notification email to host
    emailService.sendHostNotificationEmail(
      booking,
      booking.property,
      booking.host,
      booking.guest
    ).catch(err => console.error('Host email error:', err));

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment and creating booking',
      error: error.message
    });
  }
});

// @desc    Create refund
// @route   POST /api/payments/refund
// @access  Private
router.post('/refund', auth, async (req, res) => {
  try {
    const { bookingId, reason, amount } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId).populate(['property', 'guest', 'host']);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized (guest or host)
    if (booking.guest._id.toString() !== req.user.id && booking.host._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to refund this booking'
      });
    }

    // Create refund
    const refundResult = await createRefund(
      booking.paymentIntentId,
      amount, // null for full refund
      reason || 'requested_by_customer'
    );

    if (!refundResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Refund creation failed',
        error: refundResult.error
      });
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.refundDetails = {
      refundId: refundResult.refund.id,
      refundAmount: refundResult.refund.amount / 100, // Convert from cents
      refundReason: reason || 'requested_by_customer',
      refundDate: new Date()
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refund: refundResult.refund,
        booking: {
          id: booking._id,
          bookingStatus: booking.bookingStatus,
          paymentStatus: booking.paymentStatus,
          refundDetails: booking.refundDetails
        }
      }
    });

    // Send cancellation emails (async)
    const emailService = await import('../services/email.service.js');
    
    emailService.sendCancellationEmail(
      booking,
      booking.property,
      booking.guest,
      reason || 'Booking cancelled'
    ).catch(err => console.error('Cancellation email error:', err));

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
});

export default router;