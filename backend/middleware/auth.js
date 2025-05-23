
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      
      // Check if user exists and is active
      const [users] = await pool.query(
        'SELECT id, name, email, role, status FROM users WHERE id = ?',
        [decoded.id]
      );
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      const user = users[0];
      
      if (user.status !== 'active') {
        return res.status(403).json({ message: 'Account is inactive or blocked' });
      }
      
      // For drivers, check if they're verified
      if (user.role === 'driver' && req.path !== '/profile') {
        const [drivers] = await pool.query(
          'SELECT is_verified FROM drivers WHERE user_id = ?',
          [user.id]
        );
        
        if (drivers.length > 0 && !drivers[0].is_verified) {
          return res.status(403).json({ message: 'Driver account not verified yet' });
        }
      }
      
      // Set user in request
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
      
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

// Check if user is an admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// Check if user is a driver
const isDriver = (req, res, next) => {
  if (!req.user || req.user.role !== 'driver') {
    return res.status(403).json({ message: 'Access denied. Driver role required.' });
  }
  next();
};

// Check if user is a rider
const isRider = (req, res, next) => {
  if (!req.user || req.user.role !== 'rider') {
    return res.status(403).json({ message: 'Access denied. Rider role required.' });
  }
  next();
};

// Check if user owns the resource or is an admin
const isResourceOwnerOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (req.user.id === resourceUserId || req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied. You do not have permission to access this resource.' });
    }
  };
};

module.exports = {
  verifyToken,
  isAdmin,
  isDriver,
  isRider,
  isResourceOwnerOrAdmin
};
