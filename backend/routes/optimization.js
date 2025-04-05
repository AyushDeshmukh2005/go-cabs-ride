
const express = require('express');
const router = express.Router();
const optimizationController = require('../controllers/optimizationController');
const { verifyToken } = require('../middleware/auth');

// Apply auth middleware to all optimization routes
router.use(verifyToken);

// Route optimization
router.post('/routes/:ride_id', optimizationController.optimizeRoute);
router.get('/routes/:ride_id', optimizationController.getOptimizedRoute);

// Carbon footprint
router.get('/carbon/:ride_id', optimizationController.getCarbonFootprint);

// Traffic and weather data
router.get('/traffic', optimizationController.getTrafficData);
router.get('/weather', optimizationController.getWeatherData);

module.exports = router;
