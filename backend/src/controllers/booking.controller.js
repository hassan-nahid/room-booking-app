import { Booking } from '../models/booking.model.js';
import { Property } from '../models/property.model.js';
import { User } from '../models/user.model.js';
import { validationResult } from 'express-validator';
import { calculateBookingTotal } from '../services/stripe.service.js';
import { sendBookingConfirmationEmail, sendHostNotificationEmail } from '../services/email.service.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Guest)
export const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      propertyId,
      checkIn,
      checkOut,
      numberOfGuests,
      guestDetails,
      specialRequests
    } = req.body;

    // Get property details
    const property = await Property.findById(propertyId).populate('host');
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if property is active
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

    // Check availability
    const isAvailable = await Booking.checkAvailability(propertyId, new Date(checkIn), new Date(checkOut));
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for selected dates'
      });
    }

    // Calculate pricing using Stripe service
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    if (numberOfNights <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    const pricing = calculateBookingTotal(
      property.pricePerNight,
      numberOfNights,
      property.cleaningFee || 0
    );

    // Create booking with updated pricing structure
    const booking = new Booking({
      property: propertyId,
      guest: req.user.id,
      host: property.host._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numberOfGuests,
      numberOfNights,
      guestDetails: guestDetails || {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone
      },
      pricePerNight: property.pricePerNight,
      totalAmount: pricing.total,
      pricing: {
        subtotal: pricing.subtotal,
        cleaningFee: pricing.cleaningFee,
        serviceFee: pricing.serviceFee,
        tax: pricing.tax
      },
      currency: property.currency || 'USD',
      bookingStatus: property.instantBook ? 'confirmed' : 'pending',
      paymentStatus: 'pending', // Will be updated when payment is completed
      specialRequests
    });

    await booking.save();

    // Populate booking details
    await booking.populate([
      { path: 'property', select: 'title images address propertyType' },
      { path: 'guest', select: 'firstName lastName email profileImage' },
      { path: 'host', select: 'firstName lastName email profileImage' }
    ]);

    res.status(201).json({
      success: true,
      message: property.instantBook ? 'Booking confirmed! Payment is required to complete the reservation.' : 'Booking request created. Payment is required to confirm.',
      data: { 
        booking,
        pricing,
        nextStep: 'Please proceed to payment to confirm your booking'
      }
    });

    // Send emails only if booking is confirmed and payment is completed
    // (This will be handled by the payment confirmation endpoint)
    if (property.instantBook && booking.paymentStatus === 'completed') {
      // Send confirmation email to guest
      sendBookingConfirmationEmail(booking, property, req.user)
        .catch(err => console.error('Guest email error:', err));

      // Send notification email to host
      sendHostNotificationEmail(booking, property, property.host, req.user)
        .catch(err => console.error('Host email error:', err));
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const { status, type = 'guest', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query based on user type (guest or host)
    let query = {};
    if (type === 'host') {
      query.host = req.user.id;
    } else {
      query.guest = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate([
        { path: 'property', select: 'title images address propertyType pricePerNight' },
        { path: 'guest', select: 'firstName lastName email profileImage' },
        { path: 'host', select: 'firstName lastName email profileImage' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalBookings = await Booking.countDocuments(query);
    const totalPages = Math.ceil(totalBookings / limit);

    res.status(200).json({
      success: true,
      data: { bookings },
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBookings,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate([
        { path: 'property', select: 'title images address propertyType amenities rules' },
        { path: 'guest', select: 'firstName lastName email profileImage phone' },
        { path: 'host', select: 'firstName lastName email profileImage phone hostInfo' }
      ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has access to this booking
    const hasAccess = booking.guest._id.toString() === req.user.id || 
                     booking.host._id.toString() === req.user.id ||
                     req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update booking (for hosts to approve/decline)
// @route   PUT /api/bookings/:id
// @access  Private (Host)
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, hostNotes } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the host of this booking
    if (booking.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the host can update this booking'
      });
    }

    // Update allowed fields
    if (status) {
      booking.status = status;
      if (status === 'confirmed') {
        booking.confirmedAt = new Date();
      }
    }

    if (hostNotes) {
      booking.hostNotes = hostNotes;
    }

    await booking.save();

    await booking.populate([
      { path: 'property', select: 'title images address' },
      { path: 'guest', select: 'firstName lastName email' },
      { path: 'host', select: 'firstName lastName email' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user can cancel this booking
    const canCancel = booking.guest.toString() === req.user.id || 
                     booking.host.toString() === req.user.id ||
                     req.user.role === 'admin';

    if (!canCancel) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled (not already completed or cancelled)
    if (['cancelled', 'completed', 'refunded'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'This booking cannot be cancelled'
      });
    }

    await booking.cancelBooking(req.user.id, reason);

    await booking.populate([
      { path: 'property', select: 'title images' },
      { path: 'guest', select: 'firstName lastName email' },
      { path: 'host', select: 'firstName lastName email' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check property availability
// @route   GET /api/bookings/check-availability/:propertyId
// @access  Public
export const checkAvailability = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-in and check-out dates are required'
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const isAvailable = await Booking.checkAvailability(
      propertyId, 
      new Date(checkIn), 
      new Date(checkOut)
    );

    res.status(200).json({
      success: true,
      data: { 
        available: isAvailable,
        property: {
          id: property._id,
          title: property.title,
          pricePerNight: property.pricePerNight,
          maxGuests: property.maxGuests
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};