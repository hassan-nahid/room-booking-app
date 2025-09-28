// Additional filter-related controllers for Airbnb-like functionality

// @desc    Get all available filter options
// @route   GET /api/properties/filters/options
// @access  Public
export const getFilterOptions = async (req, res) => {
  try {
    const filterOptions = {
      propertyTypes: [
        'apartment', 'house', 'condo', 'villa', 'cabin', 'studio', 'loft', 
        'townhouse', 'cottage', 'bungalow', 'castle', 'treehouse', 'boat', 
        'camper', 'tent', 'other'
      ],
      categories: [
        { id: 'entire_home', name: 'Entire home/apt', description: 'Have a place to yourself' },
        { id: 'private_room', name: 'Private room', description: 'Have your own room and share some common spaces' },
        { id: 'shared_room', name: 'Shared room', description: 'Stay in a shared space, like a common room' },
        { id: 'hotel_room', name: 'Hotel room', description: 'Stay in a boutique hotel, hostel, and more' }
      ],
      styleCategories: [
        { id: 'amazing_views', name: 'Amazing views', icon: '🏔️' },
        { id: 'omg', name: 'OMG!', icon: '😱' },
        { id: 'treehouses', name: 'Treehouses', icon: '🌳' },
        { id: 'beach', name: 'Beach', icon: '🏖️' },
        { id: 'amazing_pools', name: 'Amazing pools', icon: '🏊' },
        { id: 'cabins', name: 'Cabins', icon: '🏘️' },
        { id: 'lakefront', name: 'Lakefront', icon: '🏞️' },
        { id: 'iconic_cities', name: 'Iconic cities', icon: '🏙️' },
        { id: 'countryside', name: 'Countryside', icon: '🌾' },
        { id: 'tiny_homes', name: 'Tiny homes', icon: '🏠' },
        { id: 'islands', name: 'Islands', icon: '🏝️' },
        { id: 'national_parks', name: 'National parks', icon: '🏕️' },
        { id: 'trending', name: 'Trending', icon: '📈' },
        { id: 'tropical', name: 'Tropical', icon: '🌴' },
        { id: 'luxe', name: 'Luxe', icon: '💎' },
        { id: 'beachfront', name: 'Beachfront', icon: '🌊' },
        { id: 'castles', name: 'Castles', icon: '🏰' },
        { id: 'arctic', name: 'Arctic', icon: '❄️' },
        { id: 'desert', name: 'Desert', icon: '🏜️' },
        { id: 'caves', name: 'Caves', icon: '🕳️' },
        { id: 'boats', name: 'Boats', icon: '⛵' },
        { id: 'camping', name: 'Camping', icon: '⛺' },
        { id: 'skiing', name: 'Skiing', icon: '⛷️' },
        { id: 'mansions', name: 'Mansions', icon: '🏛️' },
        { id: 'vineyards', name: 'Vineyards', icon: '🍇' },
        { id: 'farms', name: 'Farms', icon: '🚜' }
      ],
      amenities: {
        essentials: [
          { id: 'wifi', name: 'Wifi', icon: '📶' },
          { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
          { id: 'washer', name: 'Washer', icon: '🧺' },
          { id: 'dryer', name: 'Dryer', icon: '🌀' },
          { id: 'air_conditioning', name: 'Air conditioning', icon: '❄️' },
          { id: 'heating', name: 'Heating', icon: '🔥' },
          { id: 'dedicated_workspace', name: 'Dedicated workspace', icon: '💻' }
        ],
        features: [
          { id: 'pool', name: 'Pool', icon: '🏊' },
          { id: 'hot_tub', name: 'Hot tub', icon: '🛁' },
          { id: 'free_parking', name: 'Free parking', icon: '🅿️' },
          { id: 'ev_charger', name: 'EV charger', icon: '🔌' },
          { id: 'gym', name: 'Gym', icon: '🏋️' },
          { id: 'bbq_grill', name: 'BBQ grill', icon: '🔥' },
          { id: 'breakfast', name: 'Breakfast', icon: '🍳' }
        ],
        unique: [
          { id: 'beachfront', name: 'Beachfront', icon: '🏖️' },
          { id: 'waterfront', name: 'Waterfront', icon: '🌊' },
          { id: 'mountain_view', name: 'Mountain view', icon: '🏔️' },
          { id: 'ocean_view', name: 'Ocean view', icon: '🌊' },
          { id: 'lake_view', name: 'Lake view', icon: '🏞️' }
        ]
      },
      sortOptions: [
        { id: 'relevance', name: 'Recommended' },
        { id: 'price_low_to_high', name: 'Price: low to high' },
        { id: 'price_high_to_low', name: 'Price: high to low' },
        { id: 'guest_favorite', name: 'Guest favorite' },
        { id: 'review_score', name: 'Top-rated' },
        { id: 'newest', name: 'Newest' }
      ],
      priceRanges: [
        { min: 0, max: 50, label: 'Under $50' },
        { min: 50, max: 100, label: '$50 - $100' },
        { min: 100, max: 200, label: '$100 - $200' },
        { min: 200, max: 300, label: '$200 - $300' },
        { min: 300, max: null, label: '$300+' }
      ]
    };

    res.status(200).json({
      success: true,
      data: filterOptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get properties by style category (for homepage filters)
// @route   GET /api/properties/category/:styleCategory
// @access  Public
export const getPropertiesByStyleCategory = async (req, res) => {
  try {
    const { styleCategory } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const searchCriteria = {
      styleCategory,
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const { PropertyService } = await import('../services/property.service.js');
    const propertyService = new PropertyService();
    const result = await propertyService.searchProperties(searchCriteria);
    
    res.status(200).json({
      success: true,
      data: result.properties,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalProperties: result.totalProperties
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};