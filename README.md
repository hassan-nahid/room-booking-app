# 🏠 Airbnb Clone - Room Booking App

A full-stack web application that replicates core Airbnb functionality, built with modern technologies and best practices.



## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (Guest/Host)
- Profile management with image upload

### 🏡 Property Management
- Create, read, update, delete properties
- Image gallery for properties
- Dynamic pricing and availability
- Location-based search and filtering
- Categories and property types
- Amenities management

### 📅 Booking System
- Real-time availability checking
- Secure payment processing with Stripe
- Booking confirmation emails
- Guest and host booking management
- Pricing calculation with fees and taxes
- Booking status tracking

### 💳 Payment Integration
- Stripe payment processing
- Payment intents and confirmation
- Automatic refund handling
- Invoice generation
- Tax and fee calculations

### 📊 Dashboard
- Separate dashboards for guests and hosts
- Trip management for guests
- Booking management for hosts
- Property analytics and earnings
- User profile and settings

### 📧 Email Notifications
- Booking confirmation emails
- Host notification system
- Gmail SMTP integration
- Professional email templates

### 🔍 Advanced Search
- Location-based filtering
- Date range availability
- Guest count filtering
- Price range filtering
- Property type and amenity filters

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Nodemailer** - Email service
- **Stripe** - Payment processing

### DevOps & Tools
- **ESLint** - Code linting
- **Git** - Version control
- **Postman** - API testing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Git**

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hassan-nahid/room-booking-app.git
   cd room-booking-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## 🔧 Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/airbnb?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

### Frontend
No environment variables required for frontend in development.

## 🏃‍♂️ Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
airbnb-clone/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── .env
├── frontend/               # Frontend React app
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route configuration
│   │   ├── services/      # API services
│   │   └── styles/        # CSS styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Property Endpoints
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (Host only)
- `PUT /api/properties/:id` - Update property (Owner only)
- `DELETE /api/properties/:id` - Delete property (Owner only)
- `GET /api/properties/search` - Search properties

### Booking Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payment Endpoints
- `POST /api/payments/calculate` - Calculate pricing
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment



## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Notes

### Key Features Implemented
- ✅ Complete authentication system
- ✅ Property CRUD operations
- ✅ Advanced search and filtering
- ✅ Real-time booking system
- ✅ Stripe payment integration
- ✅ Email notification system
- ✅ Responsive design
- ✅ Role-based dashboards

### Upcoming Features
- 🔄 Real-time messaging
- 🔄 Review and rating system
- 🔄 Wishlist functionality
- 🔄 Advanced analytics
- 🔄 Mobile app (React Native)

## 🐛 Known Issues

- Image upload currently uses URL input (file upload coming soon)
- Real-time notifications not implemented yet
- Advanced map integration pending

## 📞 Support

If you have any questions or need help getting started:

1. Check the [Issues](https://github.com/hassan-nahid/room-booking-app/issues) page
2. Create a new issue if your problem isn't already listed
3. Contact the maintainer: [hassan-nahid](https://github.com/hassan-nahid)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Airbnb's user experience
- Built with modern React patterns and best practices
- Stripe for secure payment processing
- MongoDB for flexible data storage
- Tailwind CSS for rapid UI development

---

**Made with ❤️ by [Hassan Nahid](https://github.com/hassan-nahid)**

⭐ Star this repository if you found it helpful!
