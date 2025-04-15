
import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
  try {
    // The user data is attached to req by the verifyToken middleware
    const userData = { ...req.user };
    
    // Don't send sensitive information like password
    delete userData.password;
    
    res.status(200).json({ 
      success: true, 
      data: userData 
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update user profile
router.put('/profile', verifyToken, (req, res) => {
  try {
    // Implementation for updating user profile
    // This would typically involve database operations
    
    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
