import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  profileImage: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  role: {
    type: String,
    enum: ['guest', 'host', 'admin'],
    default: 'guest'
  },
  isHost: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Host-specific fields
  hostInfo: {
    joinedDate: {
      type: Date,
      default: Date.now
    },
    responseRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    responseTime: {
      type: String,
      default: 'within an hour'
    },
    isSuperhost: {
      type: Boolean,
      default: false
    },
    totalListings: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    languages: [{
      type: String
    }],
    verifications: [{
      type: String,
      enum: ['email', 'phone', 'government_id', 'reviews', 'work_email']
    }]
  },

  // Guest-specific fields
  guestInfo: {
    totalTrips: {
      type: Number,
      default: 0
    },
    memberSince: {
      type: Date,
      default: Date.now
    }
  },

  // Address information
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },

  // Account settings
  preferences: {
    currency: {
      type: String,
      default: 'USD'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },

  // Social login
  googleId: String,
  facebookId: String,

  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.verificationToken;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpire;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for display name (first name + last initial)
userSchema.virtual('displayName').get(function() {
  return `${this.firstName} ${this.lastName.charAt(0)}.`;
});

// Index for search optimization
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to become a host
userSchema.methods.becomeHost = function() {
  this.isHost = true;
  if (this.role !== 'admin') {
    this.role = 'host';
  }
  // Initialize host-specific fields for better performance
  this.hostInfo = this.hostInfo || {
    totalEarnings: 0,
    totalBookings: 0,
    averageRating: 0,
    responseRate: 100,
    responseTime: '< 1 hour',
    joinedAsHostDate: new Date()
  };
  return this.save();
};

// Method to update host stats
userSchema.methods.updateHostStats = function(stats) {
  if (this.isHost) {
    Object.assign(this.hostInfo, stats);
    return this.save();
  }
  throw new Error('User is not a host');
};

export const User = mongoose.model("User", userSchema);
export default User;