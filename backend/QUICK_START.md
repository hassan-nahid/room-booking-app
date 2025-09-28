# 🚀 Airbnb Clone API - Quick Start Guide

## 📋 Overview
Your Airbnb-like property booking system is now complete with comprehensive filtering capabilities, test data, and ready-to-use API endpoints!

## 🏃‍♂️ Quick Start

### 1. Start the Server
```bash
cd "f:\Self_Project\airbnb-clone\backend"
npm start
```
Server will run on: **http://localhost:5000**

### 2. Database is Already Populated! ✅
The seed script has already been run with realistic test data:
- **4 Users** (2 hosts, 1 guest, 1 both)
- **8 Properties** (various types, locations, and amenities)
- **2 Sample Bookings**



## 🏠 Sample Properties Available

1. **Stunning Beach House** (Malibu) - $285/night - Beach category
2. **Cozy Mountain Cabin** (Big Bear) - $165/night - Cabins category
3. **Modern Downtown Loft** (Los Angeles) - $125/night - Iconic cities
4. **Luxury Villa** (Beverly Hills) - $450/night - Luxe category
5. **Private Room** (San Francisco) - $65/night - Private room
6. **Unique Treehouse** (Mendocino) - $195/night - Treehouses
7. **Lakefront Cottage** (Lake Tahoe) - $145/night - Lakefront
8. **Tiny House** (Sebastopol) - $85/night - Tiny homes

## 🧪 Testing in Postman

### Option 1: Import Collection
1. Import `Airbnb_Clone_API.postman_collection.json` into Postman
2. Collection includes all endpoints with sample data
3. Auto-saves JWT token after login

### Option 2: Manual Testing

#### Step 1: Login and Get Token
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
Copy the `token` from response for authenticated requests.

#### Step 2: Test Filter Options
```
GET http://localhost:5000/api/properties/filters/options
```

#### Step 3: Advanced Search
```
GET http://localhost:5000/api/properties/search?location=Malibu&checkIn=2024-12-20&checkOut=2024-12-27&guests=4&minPrice=100&maxPrice=400&category=entire_home&styleCategory=beach&amenities=wifi,pool&instantBook=true&sortBy=relevance&page=1&limit=20
```

#### Step 4: Get Beach Properties
```
GET http://localhost:5000/api/properties/category/beach?page=1&limit=10
```

#### Step 5: Create a Booking (with auth token)
```
POST http://localhost:5000/api/bookings
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "propertyId": "PROPERTY_ID_FROM_SEARCH",
  "checkIn": "2024-12-20",
  "checkOut": "2024-12-27",
  "guests": 4,
  "specialRequests": "Late check-in please"
}
```

## 🎯 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (auth required)

### Properties & Filtering
- `GET /api/properties` - Get all properties
- `GET /api/properties/filters/options` - Get all filter options
- `GET /api/properties/search` - Advanced search with filters
- `GET /api/properties/category/:styleCategory` - Filter by category
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (host only)

### Bookings
- `POST /api/bookings` - Create booking (auth required)
- `GET /api/bookings/my-bookings` - Get user bookings (auth required)
- `GET /api/bookings/:id` - Get booking details (auth required)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (auth required)

## 🔍 Advanced Search Filters

Your API supports comprehensive filtering just like Airbnb:

### Location & Dates
- `location` - Search by city/location name
- `checkIn` - Check-in date (YYYY-MM-DD)
- `checkOut` - Check-out date (YYYY-MM-DD)
- `guests` - Number of guests

### Price & Accommodations
- `minPrice`, `maxPrice` - Price range per night
- `bedrooms`, `bathrooms`, `beds` - Room requirements

### Property Types & Categories
- `propertyType` - apartment, house, villa, cabin, etc.
- `category` - entire_home, private_room, shared_room, hotel_room
- `styleCategory` - beach, cabins, amazing_views, luxe, etc.

### Amenities & Features
- `amenities` - comma-separated (wifi,pool,parking)
- `instantBook` - true/false
- `isSuperhost` - true/false

### Sorting Options
- `sortBy` - relevance, price_low_to_high, guest_favorite, etc.

## 🎨 Style Categories (Homepage Filters)

26+ categories available including:
- `beach` 🏖️ - Beach properties
- `amazing_views` 🏔️ - Properties with amazing views
- `cabins` 🏘️ - Cozy cabins
- `luxe` 💎 - Luxury properties
- `treehouses` 🌳 - Unique treehouses
- `lakefront` 🏞️ - Lakefront properties
- `tiny_homes` 🏠 - Compact spaces
- And many more!

## 📝 Example Test Scenarios

### Scenario 1: Guest Journey
1. Register as guest → Login → Search beach properties → View details → Create booking

### Scenario 2: Host Management
1. Login as host → View properties → Create new property → View bookings

### Scenario 3: Advanced Filtering
1. Get filter options → Search with multiple criteria → Filter by category → Sort results

## 📚 Documentation Files

- `FILTERING_API.md` - Complete API documentation
- `POSTMAN_COLLECTION.md` - Detailed endpoint guide
- `Airbnb_Clone_API.postman_collection.json` - Postman collection
- `src/scripts/seed.js` - Database seeding script

## 🐛 Troubleshooting

### Server Won't Start
- Check if port 5000 is available
- Verify MongoDB connection string in `.env`
- Run `npm install` to ensure dependencies

### Database Issues
- Re-run seed script: `npm run seed`
- Check MongoDB Atlas connection
- Verify `.env` file has correct MONGO_URI

### Authentication Issues
- Ensure JWT_SECRET is set in `.env`
- Check Authorization header format: `Bearer TOKEN`
- Verify token is not expired (30 days default)

## 🎉 You're All Set!

Your Airbnb clone backend is now fully functional with:
✅ Complete user authentication system
✅ Advanced property filtering (26+ categories)
✅ Comprehensive booking system  
✅ Realistic test data
✅ Ready-to-use Postman collection
✅ Production-ready error handling and validation

Happy testing! 🚀