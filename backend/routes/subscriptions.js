
import express from 'express';
import * as subscriptionController from '../controllers/subscriptionController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all subscription plans (public)
router.get('/plans', subscriptionController.getAllPlans);

// User subscription management (requires authentication)
router.use('/user', verifyToken);
router.get('/user', subscriptionController.getUserSubscription);
router.post('/user/subscribe/:planId', subscriptionController.subscribe);
router.put('/user/cancel', subscriptionController.cancelSubscription);

// Admin subscription management (requires admin)
router.use('/admin', verifyToken, isAdmin);
router.get('/admin/all', subscriptionController.getAllSubscriptions);
router.post('/admin/plans', subscriptionController.createPlan);
router.put('/admin/plans/:id', subscriptionController.updatePlan);
router.delete('/admin/plans/:id', subscriptionController.deletePlan);

export default router;
