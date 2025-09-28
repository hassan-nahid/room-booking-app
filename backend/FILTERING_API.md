# Airbnb-like Property Filtering API Documentation

## Overview
This API provides comprehensive filtering capabilities similar to Airbnb's search system, allowing users to filter properties by various criteria including location, dates, price, amenities, and style categories.

## Search & Filter Endpoints

### 1. Advanced Property Search
**Endpoint:** `GET /api/properties/search`

**Query Parameters:**
```javascript
{
  // Basic search
  location: "New York",              // Search in location
  checkIn: "2024-01-01",            // Check-in date (ISO format)
  checkOut: "2024-01-07",           // Check-out date (ISO format)
  guests: 2,                        // Number of guests
  
  // Price filtering
  minPrice: 50,                     // Minimum price per night
  maxPrice: 200,                    // Maximum price per night
  
  // Property type & category
  propertyType: "apartment",        // apartment, house, condo, villa, etc.
  category: "entire_home",          // entire_home, private_room, shared_room, hotel_room
  styleCategory: "amazing_views",   // Style category (see options below)
  
  // Room specifications
  bedrooms: 2,                      // Minimum bedrooms
  bathrooms: 1,                     // Minimum bathrooms
  beds: 2,                          // Minimum beds
  
  // Amenities (comma-separated)
  amenities: "wifi,pool,parking",   // Required amenities
  
  // Special filters
  instantBook: true,                // Instant book only
  isSuperhost: true,               // Superhost properties only
  allowsPets: true,                // Pet-friendly properties
  
  // Property highlights (comma-separated)
  highlights: "great_location,fast_wifi", // Property highlights
  
  // Sorting & pagination
  sortBy: "relevance",              // relevance, price_low_to_high, price_high_to_low, guest_favorite, review_score, newest
  page: 1,                          // Page number
  limit: 20                         // Results per page
}
```

**Example Request:**
```
GET /api/properties/search?location=Miami&checkIn=2024-12-20&checkOut=2024-12-27&guests=4&minPrice=100&maxPrice=300&category=entire_home&styleCategory=beach&amenities=wifi,pool,parking&instantBook=true&sortBy=guest_favorite&page=1&limit=20
```

### 2. Get Filter Options
**Endpoint:** `GET /api/properties/filters/options`

Returns all available filter options for building the UI:

```json
{
  "success": true,
  "data": {
    "propertyTypes": [
      "apartment", "house", "condo", "villa", "cabin", 
      "studio", "loft", "townhouse", "cottage", "bungalow", 
      "castle", "treehouse", "boat", "camper", "tent", "other"
    ],
    "categories": [
      {
        "id": "entire_home",
        "name": "Entire home/apt",
        "description": "Have a place to yourself"
      },
      {
        "id": "private_room",
        "name": "Private room", 
        "description": "Have your own room and share some common spaces"
      }
    ],
    "styleCategories": [
      { "id": "amazing_views", "name": "Amazing views", "icon": "🏔️" },
      { "id": "omg", "name": "OMG!", "icon": "😱" },
      { "id": "treehouses", "name": "Treehouses", "icon": "🌳" },
      { "id": "beach", "name": "Beach", "icon": "🏖️" },
      { "id": "amazing_pools", "name": "Amazing pools", "icon": "🏊" }
    ]
  }
}
```

### 3. Get Properties by Style Category
**Endpoint:** `GET /api/properties/category/:styleCategory`

Get properties filtered by a specific style category (like Airbnb's homepage categories).

**Example:**
```
GET /api/properties/category/beach?page=1&limit=20
GET /api/properties/category/amazing_views?page=1&limit=20
GET /api/properties/category/cabins?page=1&limit=20
```

## Style Categories (Homepage Filters)

The following style categories are available for filtering:

| Category | Name | Icon | Description |
|----------|------|------|-------------|
| `amazing_views` | Amazing views | 🏔️ | Properties with spectacular views |
| `omg` | OMG! | 😱 | Unique and extraordinary properties |
| `treehouses` | Treehouses | 🌳 | Properties built in/around trees |
| `beach` | Beach | 🏖️ | Near beaches and coastlines |
| `amazing_pools` | Amazing pools | 🏊 | Properties with exceptional pools |
| `cabins` | Cabins | 🏘️ | Cozy cabin-style properties |
| `lakefront` | Lakefront | 🏞️ | Properties by lakes |
| `iconic_cities` | Iconic cities | 🏙️ | In famous city locations |
| `countryside` | Countryside | 🌾 | Rural and pastoral settings |
| `tiny_homes` | Tiny homes | 🏠 | Compact, efficient spaces |
| `islands` | Islands | 🏝️ | Located on islands |
| `national_parks` | National parks | 🏕️ | Near national parks |
| `tropical` | Tropical | 🌴 | Tropical climate properties |
| `luxe` | Luxe | 💎 | Luxury accommodations |
| `castles` | Castles | 🏰 | Castle and manor properties |
| `boats` | Boats | ⛵ | Houseboats and floating homes |
| `camping` | Camping | ⛺ | Glamping and camping sites |
| `skiing` | Skiing | ⛷️ | Near ski resorts |
| `mansions` | Mansions | 🏛️ | Large, luxurious homes |

## Amenities

### Essential Amenities
- `wifi` - Wifi internet
- `kitchen` - Full kitchen
- `washer` - Washing machine
- `dryer` - Clothes dryer
- `air_conditioning` - Air conditioning
- `heating` - Heating system
- `dedicated_workspace` - Work-friendly space

### Feature Amenities
- `pool` - Swimming pool
- `hot_tub` - Hot tub/jacuzzi
- `free_parking` - Free parking
- `ev_charger` - Electric vehicle charger
- `gym` - Fitness equipment
- `bbq_grill` - BBQ grill
- `breakfast` - Breakfast included

### Unique Amenities
- `beachfront` - Direct beach access
- `waterfront` - Waterfront location
- `mountain_view` - Mountain views
- `ocean_view` - Ocean views
- `lake_view` - Lake views

## Property Categories

| Category | Description |
|----------|-------------|
| `entire_home` | Entire apartment or house |
| `private_room` | Private room in shared space |
| `shared_room` | Shared room with others |
| `hotel_room` | Hotel-style room |

## Sort Options

| Sort By | Description |
|---------|-------------|
| `relevance` | Recommended (default) |
| `price_low_to_high` | Lowest price first |
| `price_high_to_low` | Highest price first |
| `guest_favorite` | Most favorited properties |
| `review_score` | Highest rated first |
| `newest` | Recently added properties |

## Response Format

All search endpoints return data in this format:

```json
{
  "success": true,
  "data": [
    {
      "_id": "property_id",
      "title": "Beautiful Beach House",
      "description": "Amazing oceanfront property",
      "images": ["image1.jpg", "image2.jpg"],
      "pricePerNight": 150,
      "currency": "USD",
      "propertyType": "house",
      "category": "entire_home",
      "styleCategory": "beach",
      "rating": 4.8,
      "reviewsCount": 127,
      "address": {
        "city": "Miami",
        "state": "FL",
        "country": "USA"
      },
      "maxGuests": 6,
      "bedrooms": 3,
      "bathrooms": 2,
      "beds": 4,
      "amenities": ["wifi", "pool", "parking"],
      "instantBook": true,
      "isSuperhost": true,
      "host": {
        "firstName": "John",
        "lastName": "Doe",
        "profileImage": "host.jpg",
        "hostInfo": {
          "isSuperhost": true,
          "responseRate": 98,
          "responseTime": "within an hour"
        }
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProperties": 95,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Example Frontend Usage

### Search with Multiple Filters
```javascript
const searchProperties = async () => {
  const params = new URLSearchParams({
    location: 'Miami Beach',
    checkIn: '2024-12-20',
    checkOut: '2024-12-27',
    guests: '4',
    minPrice: '100',
    maxPrice: '300',
    category: 'entire_home',
    styleCategory: 'beach',
    amenities: 'wifi,pool,parking',
    instantBook: 'true',
    sortBy: 'guest_favorite',
    page: '1',
    limit: '20'
  });

  const response = await fetch(`/api/properties/search?${params}`);
  const data = await response.json();
  return data;
};
```

### Get Filter Options for UI
```javascript
const getFilterOptions = async () => {
  const response = await fetch('/api/properties/filters/options');
  const data = await response.json();
  return data.data; // Contains all filter options
};
```

### Filter by Category (Homepage Style)
```javascript
const getBeachProperties = async () => {
  const response = await fetch('/api/properties/category/beach?page=1&limit=20');
  const data = await response.json();
  return data.data; // Beach properties
};
```

This filtering system provides the same comprehensive search capabilities as Airbnb, allowing users to find exactly what they're looking for with multiple filter combinations.