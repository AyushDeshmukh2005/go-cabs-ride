
const Joi = require('joi');

// Create validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errorMessages
      });
    }
    
    next();
  };
};

// Auth validation schemas
const authSchemas = {
  register: Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[0-9]).*$')),
    phone: Joi.string().pattern(new RegExp('^\\+?[0-9]{10,15}$')).required(),
    role: Joi.string().valid('rider', 'driver').required()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// User validation schemas
const userSchemas = {
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100),
    phone: Joi.string().pattern(new RegExp('^\\+?[0-9]{10,15}$')),
    email: Joi.string().email(),
    address: Joi.string().allow('', null),
    profilePicture: Joi.string().allow('', null)
  })
};

// Ride validation schemas
const rideSchemas = {
  bookRide: Joi.object({
    pickupLocation: Joi.object({
      address: Joi.string().required(),
      lat: Joi.number().required(),
      lng: Joi.number().required()
    }).required(),
    dropoffLocation: Joi.object({
      address: Joi.string().required(),
      lat: Joi.number().required(),
      lng: Joi.number().required()
    }).required(),
    rideType: Joi.string().valid('standard', 'premium', 'shared').required(),
    scheduledTime: Joi.date().iso().allow(null),
    estimatedFare: Joi.number().min(0).required(),
    paymentMethod: Joi.string().valid('cash', 'card', 'wallet').required(),
    note: Joi.string().allow('', null)
  }),
  
  rateRide: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().allow('', null)
  })
};

module.exports = {
  validate,
  authSchemas,
  userSchemas,
  rideSchemas
};
