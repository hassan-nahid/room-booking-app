import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Booking dates
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  
  // Guest information
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1
  },
  guestDetails: {
    adults: {
      type: Number,
      required: true,
      min: 1
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    },
    infants: {
      type: Number,
      default: 0,
      min: 0
    }
  },

  // Pricing
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
  },
  numberOfNights: {
    type: Number,
    required: true,
    min: 1
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Fees
  serviceFee: {
    type: Number,
    default: 0,
    min: 0
  },
  cleaningFee: {
    type: Number,
    default: 0,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Total amount
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },

  // Booking status
  status: {
    type: String,
    enum: [
      'pending',      // Waiting for host approval (if instant book is off)
      'confirmed',    // Approved by host or instant booked
      'cancelled',    // Cancelled by guest or host
      'completed',    // Stay completed
      'refunded',     // Booking refunded
      'no_show'       // Guest didn't show up
    ],
    default: 'pending'
  },

  // Payment information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer'],
    default: 'stripe'
  },
  stripePaymentIntentId: String,
  
  // Special requests and notes
  specialRequests: {
    type: String,
    maxlength: 500
  },
  hostNotes: {
    type: String,
    maxlength: 500
  },
  guestNotes: {
    type: String,
    maxlength: 500
  },

  // Cancellation
  cancellationReason: String,
  cancellationDate: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: 0
  },

  // Reviews
  guestReviewed: {
    type: Boolean,
    default: false
  },
  hostReviewed: {
    type: Boolean,
    default: false
  },

  // Timestamps
  bookedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  cancelledAt: Date,
  completedAt: Date,

  // Check-in/Check-out
  actualCheckIn: Date,
  actualCheckOut: Date,
  
  // Communication
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  return Math.round(Math.abs((this.checkOut - this.checkIn) / oneDay));
});

// Virtual for days until check-in
bookingSchema.virtual('daysUntilCheckIn').get(function() {
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((this.checkIn - today) / oneDay);
});

// Virtual for booking status display
bookingSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Pending Approval',
    'confirmed': 'Confirmed',
    'cancelled': 'Cancelled',
    'completed': 'Completed',
    'refunded': 'Refunded',
    'no_show': 'No Show'
  };
  return statusMap[this.status] || this.status;
});

// Indexes for performance
bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ guest: 1, status: 1 });
bookingSchema.index({ host: 1, status: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate derived fields
bookingSchema.pre('save', function(next) {
  // Calculate number of nights
  const oneDay = 24 * 60 * 60 * 1000;
  this.numberOfNights = Math.ceil(Math.abs((this.checkOut - this.checkIn) / oneDay));
  
  // Calculate subtotal
  this.subtotal = this.pricePerNight * this.numberOfNights;
  
  // Calculate total (subtotal + fees + tax)
  this.totalAmount = this.subtotal + this.serviceFee + this.cleaningFee + this.taxAmount;
  
  next();
});

// Static method to check availability
bookingSchema.statics.checkAvailability = async function(propertyId, checkIn, checkOut, excludeBookingId = null) {
  const query = {
    property: propertyId,
    status: { $in: ['confirmed', 'pending'] },
    $or: [
      {
        checkIn: { $lte: checkIn },
        checkOut: { $gt: checkIn }
      },
      {
        checkIn: { $lt: checkOut },
        checkOut: { $gte: checkOut }
      },
      {
        checkIn: { $gte: checkIn },
        checkOut: { $lte: checkOut }
      }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBookings = await this.find(query);
  return conflictingBookings.length === 0;
};

// Method to cancel booking
bookingSchema.methods.cancelBooking = function(cancelledBy, reason) {
  this.status = 'cancelled';
  this.cancellationDate = new Date();
  this.cancelledBy = cancelledBy;
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  return this.save();
};

// Method to confirm booking
bookingSchema.methods.confirmBooking = function() {
  this.status = 'confirmed';
  this.confirmedAt = new Date();
  return this.save();
};

// Method to complete booking
bookingSchema.methods.completeBooking = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

export const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;