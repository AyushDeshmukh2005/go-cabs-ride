
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const rideService = require('../services/rideService');
const { validate, rideSchemas } = require('../middleware/validation');

// Apply auth middleware to all ride routes
router.use(verifyToken);

// Get ride history
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.id;
    const rides = await rideService.getRideHistory(userId);
    res.json(rides);
  } catch (error) {
    console.error('API Error - Get ride history:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch ride history' 
    });
  }
});

// Get scheduled rides
router.get('/scheduled', async (req, res) => {
  try {
    const userId = req.user.id;
    const rides = await rideService.getScheduledRides(userId);
    res.json(rides);
  } catch (error) {
    console.error('API Error - Get scheduled rides:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch scheduled rides' 
    });
  }
});

// Book a ride
router.post('/', validate(rideSchemas.bookRide), async (req, res) => {
  try {
    // Implement ride booking logic
    res.status(200).json({ 
      status: 'success', 
      message: 'Ride booked successfully' 
    });
  } catch (error) {
    console.error('API Error - Book ride:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to book ride' 
    });
  }
});

// Book a ride again based on previous ride
router.post('/:id/book-again', async (req, res) => {
  try {
    const rideId = req.params.id;
    const userId = req.user.id;
    const result = await rideService.bookAgain(rideId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('API Error - Book ride again:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to book ride again' 
    });
  }
});

// Cancel a ride
router.put('/:id/cancel', async (req, res) => {
  try {
    const rideId = req.params.id;
    const userId = req.user.id;
    const result = await rideService.cancelRide(rideId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('API Error - Cancel ride:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to cancel ride' 
    });
  }
});

// Rate a ride
router.post('/:id/rating', validate(rideSchemas.rateRide), async (req, res) => {
  try {
    // Implement rating logic
    res.status(200).json({ 
      status: 'success', 
      message: 'Rating submitted successfully' 
    });
  } catch (error) {
    console.error('API Error - Rate ride:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to submit rating' 
    });
  }
});

module.exports = router;
