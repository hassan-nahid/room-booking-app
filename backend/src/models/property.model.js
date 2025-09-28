import mongoose from "mongoose";

const availabilityRangeSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true }
}, { _id: false });

const unavailableDateSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  reason: { type: String, default: 'booked' } // 'booked', 'blocked', 'maintenance'
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  }
}, { _id: false });

const propertySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 1000
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  pricePerNight: { 
    type: Number, 
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  propertyType: {
    type: String,
    required: true,
    enum: [
      'apartment', 'house', 'condo', 'villa', 'cabin', 'studio', 'loft', 
      'townhouse', 'cottage', 'bungalow', 'castle', 'treehouse', 'boat', 
      'camper', 'tent', 'other'
    ]
  },
  
  // Airbnb-style categories
  category: {
    type: String,
    required: true,
    enum: [
      'entire_home', 'private_room', 'shared_room', 'hotel_room'
    ]
  },
  
  // Property style/theme categories (like Airbnb homepage filters)
  styleCategory: {
    type: String,
    enum: [
      'amazing_views', 'omg', 'treehouses', 'beach', 'amazing_pools', 
      'cabins', 'lakefront', 'iconic_cities', 'countryside', 'tiny_homes',
      'islands', 'national_parks', 'trending', 'tropical', 'luxe',
      'beachfront', 'castles', 'arctic', 'desert', 'caves', 'boats',
      'camping', 'skiing', 'mansions', 'vineyards', 'farms', 'breakfast',
      'surfing', 'historical_homes', 'cycladic_homes', 'ryokans',
      'earth_homes', 'grand_pianos', 'towers', 'yurts', 'windmills'
    ]
  },
  rating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  reviews: [reviewSchema],
  address: {
    type: addressSchema,
    required: true
  },
  // Kept for backward compatibility
  location: {
    city: String,
    country: String,
    lat: Number,
    lng: Number
  },
  maxGuests: { 
    type: Number, 
    required: true,
    min: 1
  },
  // Kept for backward compatibility
  guests: Number,
  bedrooms: { 
    type: Number, 
    required: true,
    min: 0
  },
  bathrooms: { 
    type: Number, 
    required: true,
    min: 0
  },
  // Kept for backward compatibility
  baths: Number,
  beds: {
    type: Number,
    required: true,
    min: 1
  },
  amenities: {
    type: [String],
    default: [],
    enum: [
      // Essential amenities
      'wifi', 'kitchen', 'washer', 'dryer', 'air_conditioning', 'heating',
      'dedicated_workspace', 'tv', 'hair_dryer', 'iron',
      
      // Features
      'pool', 'hot_tub', 'free_parking', 'ev_charger', 'crib', 'gym',
      'bbq_grill', 'breakfast', 'indoor_fireplace', 'smoking_allowed',
      
      // Location features  
      'beachfront', 'waterfront', 'ski_in_out', 'mountain_view', 'ocean_view',
      'lake_view', 'city_skyline_view', 'park_view', 'garden_view',
      
      // Safety features
      'smoke_alarm', 'carbon_monoxide_alarm', 'first_aid_kit', 'fire_extinguisher',
      'security_cameras', 'lockbox', 'hangers', 'bed_linens', 'extra_pillows',
      
      // Accessibility
      'step_free_access', 'wide_entrance', 'accessible_parking', 'elevator',
      'wide_hallways', 'accessible_bathroom', 'ceiling_hoist',
      
      // Unique amenities
      'piano', 'pool_table', 'exercise_equipment', 'lake_access', 'beach_access',
      'ski_equipment', 'kayak', 'bikes', 'hammock', 'outdoor_shower'
    ]
  },
  
  // Detailed amenity categories for better filtering
  amenityCategories: {
    essentials: [String],
    features: [String],
    location: [String],
    safety: [String],
    accessibility: [String]
  },
  rules: {
    checkIn: { type: String, default: '3:00 PM' },
    checkOut: { type: String, default: '11:00 AM' },
    smokingAllowed: { type: Boolean, default: false },
    petsAllowed: { type: Boolean, default: false },
    partiesAllowed: { type: Boolean, default: false },
    additionalRules: [String]
  },
  availability: [availabilityRangeSchema],
  unavailableDates: [unavailableDateSchema],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  instantBook: {
    type: Boolean,
    default: false
  },
  
  // Booking and pricing options
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict', 'super_strict_30', 'super_strict_60'],
    default: 'moderate'
  },
  minimumStay: {
    type: Number,
    default: 1,
    min: 1
  },
  maximumStay: {
    type: Number,
    default: 30,
    min: 1
  },
  
  // Additional fees (like Airbnb)
  cleaningFee: {
    type: Number,
    default: 0,
    min: 0
  },
  securityDeposit: {
    type: Number,
    default: 0,
    min: 0
  },
  extraGuestFee: {
    type: Number,
    default: 0,
    min: 0
  },
  weeklyDiscount: {
    type: Number,
    default: 0,
    min: 0,
    max: 50
  },
  monthlyDiscount: {
    type: Number,
    default: 0,
    min: 0,
    max: 50
  },
  
  // Special property features for filtering
  isSuperhost: {
    type: Boolean,
    default: false
  },
  isGuestFavorite: {
    type: Boolean,
    default: false
  },
  allowsPets: {
    type: Boolean,
    default: false
  },
  allowsSmoking: {
    type: Boolean,
    default: false
  },
  allowsEvents: {
    type: Boolean,
    default: false
  },
  allowsChildren: {
    type: Boolean,
    default: true
  },
  allowsInfants: {
    type: Boolean,
    default: true
  },
  
  // Language support
  hostLanguages: [{
    type: String,
    enum: ['english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'chinese', 'japanese', 'korean', 'other']
  }],
  
  // Property highlights for filtering
  highlights: [{
    type: String,
    enum: [
      'rare_find', 'experienced_host', 'great_location', 'great_value', 
      'highly_rated', 'recent_bookings', 'fast_wifi', 'self_checkin',
      'sparkling_clean', 'spacious', 'unique_space'
    ]
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for average rating calculation
propertySchema.virtual('averageRating').get(function() {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / this.reviews.length).toFixed(1);
  }
  return 0;
});

// Index for search optimization
propertySchema.index({ 'address.city': 'text', 'address.state': 'text', 'address.country': 'text', title: 'text' });
propertySchema.index({ pricePerNight: 1 });
propertySchema.index({ rating: -1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ host: 1 });
propertySchema.index({ isActive: 1 });
propertySchema.index({ isFeatured: 1 });

// Pre-save middleware to update the updatedAt field
propertySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware to sync deprecated fields
propertySchema.pre('save', function(next) {
  if (this.address) {
    this.location = {
      city: this.address.city,
      country: this.address.country,
      lat: this.address.coordinates.latitude,
      lng: this.address.coordinates.longitude
    };
  }
  
  if (this.maxGuests && !this.guests) {
    this.guests = this.maxGuests;
  }
  
  if (this.bathrooms && !this.baths) {
    this.baths = this.bathrooms;
  }
  
  next();
});

export const Property = mongoose.model("Property", propertySchema);
export default Property;
