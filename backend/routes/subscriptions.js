
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { verifyToken } = require('../middleware/auth');

// Get all subscription plans (public)
router.get('/plans', subscriptionController.getAllPlans);

// User subscription management (requires authentication)
router.use('/user', verifyToken);
router.get('/user', subscriptionController.getUserSubscription);
router.post('/user/subscribe/:planId', subscriptionController.subscribe);
router.put('/user/cancel', subscriptionController.cancelSubscription);

// Admin subscription management (requires admin)
const { isAdmin } = require('../middleware/auth');
router.use('/admin', verifyToken, isAdmin);
router.get('/admin/all', subscriptionController.getAllSubscriptions);
router.post('/admin/plans', subscriptionController.createPlan);
router.put('/admin/plans/:id', subscriptionController.updatePlan);
router.delete('/admin/plans/:id', subscriptionController.deletePlan);

module.exports = router;
