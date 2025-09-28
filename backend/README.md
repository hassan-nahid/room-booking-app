# Airbnb Clone Backend

A full-featured Airbnb clone backend API built with Node.js, Express, and MongoDB.

## 🚀 Features

### Authentication & Authorization
- User registration and login with JWT
- Role-based access control (Guest, Host, Admin)
- Password hashing with bcrypt
- Protected routes with middleware
- Email verification and password reset

### Property Management
- Create, read, update, delete properties
- Image upload and management
- Advanced search and filtering
- Location-based queries
- Featured properties
- Host property management

### Booking System
- Property availability checking
- Booking creation and management
- Instant booking and approval workflow
- Booking status tracking
- Cancellation handling

### User Management
- User profiles and preferences
- Host onboarding
- Guest and host information
- Profile image upload

### Security & Performance
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- Error handling middleware

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Security:** helmet, cors, express-rate-limit
- **File Upload:** multer
- **Image Storage:** Cloudinary
- **Payment:** Stripe
- **Email:** nodemailer

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd airbnb-clone/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/airbnb-clone
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /register          - Register new user
POST   /login             - Login user
GET    /me                - Get current user profile
PUT    /profile           - Update user profile
PUT    /change-password   - Change password
POST   /become-host       - Become a host
POST   /logout            - Logout user
```

### Property Routes (`/api/properties`)
```
GET    /                  - Get all properties
GET    /search            - Search properties
GET    /featured          - Get featured properties
GET    /location/:location - Get properties by location
GET    /host/:hostId      - Get properties by host
GET    /:id               - Get single property
POST   /                  - Create property (Host only)
PUT    /:id               - Update property (Owner only)
DELETE /:id               - Delete property (Owner only)
```

### Booking Routes (`/api/bookings`)
```
GET    /check-availability/:propertyId - Check property availability
POST   /                  - Create booking
GET    /my-bookings       - Get user's bookings
GET    /:id               - Get single booking
PUT    /:id               - Update booking (Host only)
DELETE /:id               - Cancel booking
```

## 🔒 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Data Models

### User Model
- Personal information (name, email, phone)
- Authentication data (password, tokens)
- Role management (guest, host, admin)
- Host-specific information
- Preferences and settings

### Property Model
- Property details (title, description, images)
- Location and address information
- Pricing and availability
- Amenities and rules
- Host reference
- Reviews and ratings

### Booking Model
- Property and user references
- Check-in/check-out dates
- Guest information and count
- Pricing breakdown
- Status tracking
- Payment information
- Messages and notes

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🔧 Development

### Project Structure
```
src/
├── controllers/         # Route handlers
├── models/             # Database models
├── routes/             # API routes
├── services/           # Business logic
├── middleware/         # Custom middleware
├── utils/              # Utility functions
└── server.js           # Application entry point
```

### Environment Variables
See `.env.example` for all required environment variables.

### Database Seeding
```bash
npm run seed
```

## 📄 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email support@airbnb-clone.com or create an issue in the repository.

## 📄 License

This project is licensed under the ISC License.