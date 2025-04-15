
import express from 'express';
import * as emergencyController from '../controllers/emergencyController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all emergency routes
router.use(verifyToken);

// Emergency contacts
router.get('/contacts', emergencyController.getUserEmergencyContacts);
router.post('/contacts', emergencyController.addEmergencyContact);
router.put('/contacts/:id', emergencyController.updateEmergencyContact);
router.delete('/contacts/:id', emergencyController.deleteEmergencyContact);

// SOS alerts
router.post('/sos', emergencyController.sendSOSAlert);
router.post('/driver-swap', emergencyController.requestDriverSwap);

export default router;
