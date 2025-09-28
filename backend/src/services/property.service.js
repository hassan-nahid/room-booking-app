import { Property } from "../models/property.model.js";

export class PropertyService {
  // Create a new property
  async createProperty(propertyData) {
    try {
      const property = new Property(propertyData);
      return await property.save();
    } catch (error) {
      throw new Error(`Error creating property: ${error.message}`);
    }
  }

  // Get all properties with pagination and sorting
  async getAllProperties(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      const skip = (page - 1) * limit;
      const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const properties = await Property.find({ isActive: true })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('host', 'name email profileImage')
        .lean();

      const totalProperties = await Property.countDocuments({ isActive: true });
      const totalPages = Math.ceil(totalProperties / limit);

      return {
        properties,
        currentPage: page,
        totalPages,
        totalProperties,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };
    } catch (error) {
      throw new Error(`Error fetching properties: ${error.message}`);
    }
  }

  // Get single property by ID
  async getPropertyById(propertyId) {
    try {
      const property = await Property.findById(propertyId)
        .populate('host', 'firstName lastName phone email hostInfo profileImage joinedDate')
        .populate('reviews.user', 'name profileImage')
        .lean();

      return property;
    } catch (error) {
      throw new Error(`Error fetching property: ${error.message}`);
    }
  }

  // Update property
  async updateProperty(propertyId, updateData) {
    try {
      const property = await Property.findByIdAndUpdate(
        propertyId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('host', 'name email profileImage');

      return property;
    } catch (error) {
      throw new Error(`Error updating property: ${error.message}`);
    }
  }

  // Delete property (soft delete)
  async deleteProperty(propertyId) {
    try {
      const property = await Property.findByIdAndUpdate(
        propertyId,
        { isActive: false, deletedAt: new Date() },
        { new: true }
      );

      return property;
    } catch (error) {
      throw new Error(`Error deleting property: ${error.message}`);
    }
  }

  // Search properties with filters (Airbnb-style)
  async searchProperties(searchCriteria) {
    try {
      const {
        location,
        checkIn,
        checkOut,
        guests,
        minPrice,
        maxPrice,
        propertyType,
        category,
        styleCategory,
        amenities,
        instantBook,
        isSuperhost,
        allowsPets,
        bedrooms,
        bathrooms,
        beds,
        highlights,
        sortBy = 'relevance',
        page = 1,
        limit = 20
      } = searchCriteria;

      // Build search query
      const query = { isActive: true };

      // Location search (case-insensitive)
      if (location) {
        query.$or = [
          { 'address.city': { $regex: location, $options: 'i' } },
          { 'address.state': { $regex: location, $options: 'i' } },
          { 'address.country': { $regex: location, $options: 'i' } },
          { title: { $regex: location, $options: 'i' } }
        ];
      }

      // Guest capacity
      if (guests) {
        query.maxGuests = { $gte: guests };
      }

      // Price range
      if (minPrice || maxPrice) {
        query.pricePerNight = {};
        if (minPrice) query.pricePerNight.$gte = minPrice;
        if (maxPrice) query.pricePerNight.$lte = maxPrice;
      }

      // Property type
      if (propertyType) {
        query.propertyType = propertyType;
      }

      // Property category (entire home, private room, etc.)
      if (category) {
        query.category = category;
      }

      // Style category (amazing views, cabins, etc.)
      if (styleCategory) {
        query.styleCategory = styleCategory;
      }

      // Room specifications
      if (bedrooms !== undefined) {
        query.bedrooms = bedrooms === 0 ? { $gte: 0 } : { $gte: bedrooms };
      }

      if (bathrooms !== undefined) {
        query.bathrooms = bathrooms === 0 ? { $gte: 0 } : { $gte: bathrooms };
      }

      if (beds !== undefined) {
        query.beds = beds === 0 ? { $gte: 1 } : { $gte: beds };
      }

      // Amenities (support multiple amenities)
      if (amenities && amenities.length > 0) {
        query.amenities = { $all: amenities }; // Must have ALL specified amenities
      }

      // Special filters
      if (instantBook === true) {
        query.instantBook = true;
      }

      if (isSuperhost === true) {
        query.isSuperhost = true;
      }

      if (allowsPets === true) {
        query.allowsPets = true;
      }

      // Property highlights
      if (highlights && highlights.length > 0) {
        query.highlights = { $in: highlights };
      }

      // Date availability check (if dates provided)
      if (checkIn && checkOut) {
        // This would require a more complex query to check booking availability
        // For now, we'll skip unavailable properties based on existing bookings
        query.unavailableDates = {
          $not: {
            $elemMatch: {
              $or: [
                {
                  start: { $lte: new Date(checkIn) },
                  end: { $gte: new Date(checkIn) }
                },
                {
                  start: { $lte: new Date(checkOut) },
                  end: { $gte: new Date(checkOut) }
                },
                {
                  start: { $gte: new Date(checkIn) },
                  end: { $lte: new Date(checkOut) }
                }
              ]
            }
          }
        };
      }

      const skip = (page - 1) * limit;

      // Define sorting options (like Airbnb)
      let sortOptions = {};
      switch (sortBy) {
        case 'price_low_to_high':
          sortOptions = { pricePerNight: 1 };
          break;
        case 'price_high_to_low':
          sortOptions = { pricePerNight: -1 };
          break;
        case 'guest_favorite':
          sortOptions = { isGuestFavorite: -1, rating: -1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'review_score':
          sortOptions = { rating: -1, reviewsCount: -1 };
          break;
        case 'distance':
          // Would need geospatial queries for actual distance sorting
          sortOptions = { createdAt: -1 };
          break;
        case 'relevance':
        default:
          // Relevance algorithm: prioritize superhost, guest favorite, high ratings
          sortOptions = { 
            isSuperhost: -1, 
            isGuestFavorite: -1, 
            rating: -1, 
            reviewsCount: -1,
            createdAt: -1 
          };
          break;
      }

      const properties = await Property.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('host', 'firstName lastName profileImage hostInfo.isSuperhost hostInfo.responseRate hostInfo.responseTime')
        .lean();

      const totalProperties = await Property.countDocuments(query);
      const totalPages = Math.ceil(totalProperties / limit);

      return {
        properties,
        currentPage: page,
        totalPages,
        totalProperties
      };
    } catch (error) {
      throw new Error(`Error searching properties: ${error.message}`);
    }
  }

  // Get properties by host
  async getPropertiesByHost(hostId, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const properties = await Property.find({ host: hostId, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('host', 'name email profileImage')
        .lean();

      const totalProperties = await Property.countDocuments({ host: hostId, isActive: true });
      const totalPages = Math.ceil(totalProperties / limit);

      return {
        properties,
        currentPage: page,
        totalPages,
        totalProperties
      };
    } catch (error) {
      throw new Error(`Error fetching host properties: ${error.message}`);
    }
  }

  // Get featured properties
  async getFeaturedProperties(limit = 6) {
    try {
      const properties = await Property.find({
        isActive: true,
        isFeatured: true
      })
        .sort({ rating: -1, createdAt: -1 })
        .limit(limit)
        .populate('host', 'name email profileImage')
        .lean();

      return properties;
    } catch (error) {
      throw new Error(`Error fetching featured properties: ${error.message}`);
    }
  }

  // Get properties by location
  async getPropertiesByLocation(location, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const query = {
        isActive: true,
        $or: [
          { 'address.city': { $regex: location, $options: 'i' } },
          { 'address.state': { $regex: location, $options: 'i' } },
          { 'address.country': { $regex: location, $options: 'i' } }
        ]
      };

      const properties = await Property.find(query)
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('host', 'name email profileImage')
        .lean();

      const totalProperties = await Property.countDocuments(query);
      const totalPages = Math.ceil(totalProperties / limit);

      return {
        properties,
        currentPage: page,
        totalPages,
        totalProperties
      };
    } catch (error) {
      throw new Error(`Error fetching properties by location: ${error.message}`);
    }
  }
}