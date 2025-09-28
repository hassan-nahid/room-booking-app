# Airbnb Clone API - Postman Collection

## Base URL: `http://localhost:5000`

---

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "testuser@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "guest"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "Test",
      "lastName": "User",
      "email": "testuser@example.com",
      "role": "guest"
    },
    "token": "jwt_token_here"
  }
}
```

---

### 2. Login User
**POST** `/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "host"
    },
    "token": "jwt_token_here"
  }
}
```

---

### 3. Get Current User Profile
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "host",
    "hostInfo": {
      "isSuperhost": true,
      "responseRate": 98
    }
  }
}
```

---

## 🏠 Property Endpoints

### 4. Get All Properties
**GET** `/api/properties`

**Query Parameters (Optional):**
```
?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "property_id",
      "title": "Stunning Beach House with Ocean Views",
      "pricePerNight": 285,
      "currency": "USD",
      "propertyType": "house",
      "category": "entire_home",
      "styleCategory": "beach",
      "rating": 4.8,
      "reviewsCount": 45,
      "images": ["image1.jpg", "image2.jpg"],
      "maxGuests": 8,
      "bedrooms": 4,
      "bathrooms": 3,
      "instantBook": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalProperties": 15,
    "hasNextPage": true
  }
}
```

---

### 5. Get Filter Options
**GET** `/api/properties/filters/options`

**No body required**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "propertyTypes": ["apartment", "house", "condo", "villa", "cabin"],
    "categories": [
      {
        "id": "entire_home",
        "name": "Entire home/apt",
        "description": "Have a place to yourself"
      }
    ],
    "styleCategories": [
      {
        "id": "amazing_views",
        "name": "Amazing views",
        "icon": "🏔️"
      }
    ],
    "amenities": {
      "essential": ["wifi", "kitchen", "washer"],
      "features": ["pool", "hot_tub", "free_parking"],
      "unique": ["beachfront", "mountain_view", "ocean_view"]
    },
    "sortOptions": [
      {
        "id": "relevance",
        "name": "Recommended"
      }
    ]
  }
}
```

---

### 6. Advanced Property Search
**GET** `/api/properties/search`

**Query Parameters:**
```
?location=Miami
&checkIn=2024-12-20
&checkOut=2024-12-27
&guests=4
&minPrice=100
&maxPrice=300
&category=entire_home
&styleCategory=beach
&amenities=wifi,pool,parking
&instantBook=true
&sortBy=guest_favorite
&page=1
&limit=20
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "property_id",
      "title": "Stunning Beach House with Ocean Views",
      "pricePerNight": 285,
      "address": {
        "city": "Malibu",
        "state": "CA",
        "country": "USA"
      },
      "maxGuests": 8,
      "amenities": ["wifi", "pool", "parking", "beachfront"],
      "instantBook": true,
      "host": {
        "firstName": "John",
        "hostInfo": {
          "isSuperhost": true
        }
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalProperties": 45
  },
  "filters": {
    "appliedFilters": {
      "location": "Miami",
      "priceRange": "100-300",
      "category": "entire_home"
    }
  }
}
```

---

### 7. Get Properties by Style Category
**GET** `/api/properties/category/beach`

**Query Parameters (Optional):**
```
?page=1&limit=10
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "property_id",
      "title": "Stunning Beach House with Ocean Views",
      "styleCategory": "beach",
      "pricePerNight": 285,
      "images": ["image1.jpg"],
      "rating": 4.8
    }
  ],
  "category": {
    "id": "beach",
    "name": "Beach",
    "icon": "🏖️"
  }
}
```

---

### 8. Get Single Property Details
**GET** `/api/properties/:id`

**Replace `:id` with actual property ID**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "property_id",
    "title": "Stunning Beach House with Ocean Views",
    "description": "Wake up to breathtaking ocean views...",
    "images": ["image1.jpg", "image2.jpg", "image3.jpg"],
    "pricePerNight": 285,
    "currency": "USD",
    "propertyType": "house",
    "category": "entire_home",
    "styleCategory": "beach",
    "address": {
      "street": "123 Ocean Drive",
      "city": "Malibu",
      "state": "CA",
      "country": "USA"
    },
    "maxGuests": 8,
    "bedrooms": 4,
    "bathrooms": 3,
    "beds": 5,
    "amenities": ["wifi", "kitchen", "pool", "beachfront"],
    "houseRules": ["No smoking", "No parties"],
    "instantBook": true,
    "host": {
      "firstName": "John",
      "lastName": "Doe",
      "profileImage": "host.jpg",
      "hostInfo": {
        "isSuperhost": true,
        "responseRate": 98,
        "hostingSince": "2020-01-15"
      }
    },
    "rating": 4.8,
    "reviewsCount": 45
  }
}
```

---

### 9. Create New Property (Host Only)
**POST** `/api/properties`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "My Beautiful Apartment",
  "description": "A lovely place to stay in the heart of the city",
  "images": [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
  ],
  "pricePerNight": 120,
  "currency": "USD",
  "propertyType": "apartment",
  "category": "entire_home",
  "styleCategory": "iconic_cities",
  "address": {
    "street": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "country": "USA",
    "zipCode": "90210",
    "coordinates": [-118.2437, 34.0522]
  },
  "maxGuests": 4,
  "bedrooms": 2,
  "bathrooms": 1,
  "beds": 2,
  "amenities": ["wifi", "kitchen", "air_conditioning"],
  "houseRules": ["No smoking", "No parties"],
  "instantBook": true,
  "minimumStay": 1,
  "maximumStay": 30
}
```

---

### 10. Update Property (Host Only)
**PUT** `/api/properties/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Updated Property Title",
  "pricePerNight": 150,
  "amenities": ["wifi", "kitchen", "pool", "parking"]
}
```

---

### 11. Delete Property (Host Only)
**DELETE** `/api/properties/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📅 Booking Endpoints

### 12. Create Booking
**POST** `/api/bookings`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "propertyId": "PROPERTY_ID_HERE",
  "checkIn": "2024-12-20",
  "checkOut": "2024-12-27",
  "guests": 4,
  "specialRequests": "Late check-in please"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "booking_id",
    "property": {
      "title": "Stunning Beach House",
      "pricePerNight": 285
    },
    "checkIn": "2024-12-20",
    "checkOut": "2024-12-27",
    "guests": 4,
    "totalAmount": 1995,
    "finalAmount": 2245.75,
    "status": "pending"
  }
}
```

---

### 13. Get User's Bookings
**GET** `/api/bookings/my-bookings`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters (Optional):**
```
?status=confirmed&page=1&limit=10
```

---

### 14. Get Booking Details
**GET** `/api/bookings/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 15. Cancel Booking
**PATCH** `/api/bookings/:id/cancel`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 16. Confirm Booking (Host Only)
**PATCH** `/api/bookings/:id/confirm`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🧪 Testing Scenarios

### Scenario 1: Complete User Journey
1. **Register** a new user as guest
2. **Login** with credentials
3. **Search** for beach properties in Malibu
4. **View** property details
5. **Create** a booking
6. **View** booking details

### Scenario 2: Host Management
1. **Login** as host (john@example.com)
2. **Create** a new property
3. **View** all your properties
4. **Update** property details
5. **View** bookings for your properties

### Scenario 3: Advanced Filtering
1. **Get** filter options
2. **Search** with multiple filters:
   - Location: "Los Angeles"
   - Price: $50-$200
   - Category: "entire_home"
   - Amenities: "wifi,pool"
   - Guests: 4
3. **Filter** by style category "luxe"
4. **Sort** by price low to high

---

## 🔑 Test User Credentials

Use these accounts for testing:

```
Superhost: john@example.com / password123
Regular Host: sarah@example.com / password123
Guest: mike@example.com / password123
Both Roles: emma@example.com / password123
```

---

## 📝 Notes for Testing

1. **Run the seed script first** to populate test data:
   ```bash
   npm run seed
   ```

2. **Always include Authorization header** for protected endpoints

3. **Property IDs** will be generated after seeding - use the actual IDs from database

4. **Date formats** should be in YYYY-MM-DD format

5. **Price filtering** works with min/max parameters

6. **Amenities filtering** accepts comma-separated values

7. **Pagination** is available on all list endpoints

8. **Error responses** follow this format:
   ```json
   {
     "success": false,
     "message": "Error description",
     "errors": ["Detailed error messages"]
   }
   ```

---

## 🚀 Quick Start Testing

1. Start the server: `npm start`
2. Run the seed script: `npm run seed`
3. Import this collection into Postman
4. Set up environment variable: `BASE_URL = http://localhost:5000`
5. Test the endpoints in order!

Happy testing! 🎉