const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// IMPORTANT: More specific routes must come before general routes

// Get popular cities (must be before /cities)
router.get('/cities/popular', locationController.getPopularCities);

// Search cities by query (must be before /cities)
router.get('/cities/search', locationController.searchCities);

// Get all cities (grouped by alphabet)
router.get('/cities', locationController.getAllCities);

// Get current location city from coordinates
router.get('/current', locationController.getCurrentLocation);

module.exports = router;
