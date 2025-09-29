import { PropertyService } from "../services/property.service.js";

const propertyService = new PropertyService();

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Host only)
export const createProperty = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      host: req.user.id // Add host reference from authenticated user
    };
    const property = await propertyService.createProperty(propertyData);
    
    res.status(201).json({
      success: true,
      data: property,
      message: "Property created successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getAllProperties = async (req, res) => {
  try {
    const { page = 1, limit = 1000, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder
    };

    const result = await propertyService.getAllProperties(options);
    
    res.status(200).json({
      success: true,
      data: result.properties,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalProperties: result.totalProperties,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await propertyService.getPropertyById(id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Property owner only)
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const property = await propertyService.updateProperty(id, updateData);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    res.status(200).json({
      success: true,
      data: property,
      message: "Property updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Property owner only)
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await propertyService.deleteProperty(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search properties
// @route   GET /api/properties/search
// @access  Public
export const searchProperties = async (req, res) => {
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
    } = req.query;

    const searchCriteria = {
      location,
      checkIn,
      checkOut,
      guests: guests ? parseInt(guests) : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      propertyType,
      category,
      styleCategory,
      amenities: amenities ? amenities.split(',') : undefined,
      instantBook: instantBook === 'true',
      isSuperhost: isSuperhost === 'true',
      allowsPets: allowsPets === 'true',
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      beds: beds ? parseInt(beds) : undefined,
      highlights: highlights ? highlights.split(',') : undefined,
      sortBy,
      page: parseInt(page),
      limit: parseInt(limit)
    };

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

// @desc    Get properties by host
// @route   GET /api/properties/host/:hostId
// @access  Public
export const getPropertiesByHost = async (req, res) => {
  try {
    const { hostId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await propertyService.getPropertiesByHost(hostId, options);
    
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

// @desc    Get current user's properties
// @route   GET /api/properties/my-properties
// @access  Private (Host only)
export const getMyProperties = async (req, res) => {
  try {
    const hostId = req.user.id; // Get from authenticated user
    const { page = 1, limit = 10 } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await propertyService.getPropertiesByHost(hostId, options);
    
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

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
export const getFeaturedProperties = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const properties = await propertyService.getFeaturedProperties(parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get properties by location
// @route   GET /api/properties/location/:location
// @access  Public
export const getPropertiesByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await propertyService.getPropertiesByLocation(location, options);
    
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
