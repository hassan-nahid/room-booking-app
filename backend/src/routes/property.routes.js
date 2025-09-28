import { Router } from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  searchProperties,
  getPropertiesByHost,  
  getMyProperties,
  getFeaturedProperties,
  getPropertiesByLocation
} from "../controllers/property.controller.js";
import {
  getFilterOptions,
  getPropertiesByStyleCategory
} from "../controllers/filter.controller.js";
import { auth, requireHost, checkOwnership } from "../middleware/auth.middleware.js";
import { Property } from "../models/property.model.js";

const router = Router();

// GET /api/properties - Get all properties with optional pagination and filters
router.get("/", getAllProperties);

// GET /api/properties/search - Search properties by location, dates, guests, etc.
router.get("/search", searchProperties);

// GET /api/properties/filters/options - Get all available filter options
router.get("/filters/options", getFilterOptions);

// GET /api/properties/featured - Get featured properties
router.get("/featured", getFeaturedProperties);

// GET /api/properties/category/:styleCategory - Get properties by style category
router.get("/category/:styleCategory", getPropertiesByStyleCategory);

// GET /api/properties/location/:location - Get properties by location
router.get("/location/:location", getPropertiesByLocation);

// GET /api/properties/my-properties - Get current user's properties
router.get("/my-properties", auth, requireHost, getMyProperties);

// GET /api/properties/host/:hostId - Get properties by host ID
router.get("/host/:hostId", getPropertiesByHost);

// GET /api/properties/:id - Get single property by ID
router.get("/:id", getPropertyById);

// POST /api/properties - Create new property (Host only)
router.post("/", auth, requireHost, createProperty);

// PUT /api/properties/:id - Update property by ID (Owner only)
router.put("/:id", auth, checkOwnership(Property), updateProperty);

// DELETE /api/properties/:id - Delete property by ID (Owner only)
router.delete("/:id", auth, checkOwnership(Property), deleteProperty);

export const propertiesRoute = router;