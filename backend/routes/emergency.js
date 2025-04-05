
const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const { verifyToken } = require('../middleware/auth');

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

module.exports = router;
