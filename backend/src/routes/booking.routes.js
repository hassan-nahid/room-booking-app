import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  checkAvailability
} from '../controllers/booking.controller.js';
import { auth, requireHost } from '../middleware/auth.middleware.js';

const router = Router();

// Validation rules
const createBookingValidation = [
  body('propertyId')
    .isMongoId()
    .withMessage('Valid property ID is required'),
  body('checkIn')
    .isISO8601()
    .toDate()
    .withMessage('Valid check-in date is required'),
  body('checkOut')
    .isISO8601()
    .toDate()
    .withMessage('Valid check-out date is required')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.checkIn)) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),
  body('numberOfGuests')
    .isInt({ min: 1 })
    .withMessage('Number of guests must be at least 1'),
  body('guestDetails.adults')
    .isInt({ min: 1 })
    .withMessage('At least 1 adult is required'),
  body('guestDetails.children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Children count must be 0 or more'),
  body('guestDetails.infants')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Infants count must be 0 or more'),
  body('specialRequests')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Special requests must be less than 500 characters')
];

const availabilityValidation = [
  query('checkIn')
    .isISO8601()
    .withMessage('Valid check-in date is required'),
  query('checkOut')
    .isISO8601()
    .withMessage('Valid check-out date is required')
];

// Public routes
router.get('/check-availability/:propertyId', availabilityValidation, checkAvailability);

// Protected routes
router.post('/', auth, createBookingValidation, createBooking);
router.get('/my-bookings', auth, getMyBookings);
router.get('/my-trips', auth, getMyBookings); // Alias for guest bookings
router.get('/host-bookings', auth, requireHost, getMyBookings); // Host-specific route
router.get('/:id', auth, getBookingById);
router.put('/:id', auth, updateBooking);
router.delete('/:id', auth, cancelBooking);

export const bookingRoutes = router;