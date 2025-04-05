
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Apply auth middleware to all admin routes
router.use(verifyToken, isAdmin);

// Driver management
router.get('/drivers', adminController.getAllDrivers);
router.get('/drivers/pending', adminController.getPendingDrivers);
router.put('/drivers/:id/verify', adminController.verifyDriver);
router.put('/drivers/:id/block', adminController.blockDriver);
router.put('/drivers/:id/unblock', adminController.unblockDriver);

// Rider management
router.get('/riders', adminController.getAllRiders);
router.put('/riders/:id/block', adminController.blockRider);
router.put('/riders/:id/unblock', adminController.unblockRider);

// Ride management
router.get('/rides', adminController.getAllRides);
router.get('/rides/active', adminController.getActiveRides);
router.get('/rides/:id', adminController.getRideDetails);
router.put('/rides/:id/reassign', adminController.reassignRide);
router.put('/rides/:id/cancel', adminController.cancelRide);

// Reports
router.get('/reports/drivers', adminController.getDriverReports);
router.get('/reports/riders', adminController.getRiderReports);
router.get('/reports/revenue', adminController.getRevenueReports);
router.get('/reports/activity', adminController.getActivityLogs);

// Dashboard data
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/recent-activity', adminController.getRecentActivity);

module.exports = router;
