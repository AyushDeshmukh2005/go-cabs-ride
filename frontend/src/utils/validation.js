
/**
 * Validation utility functions for form inputs
 */

// Email validation
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Password validation (min 8 chars, at least one letter and one number)
export const isValidPassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(password);
};

// Phone number validation
export const isValidPhone = (phone) => {
  const regex = /^\+?[0-9]{10,15}$/;
  return regex.test(phone);
};

// Check if string is empty or only whitespace
export const isEmptyString = (str) => {
  return !str || str.trim() === '';
};

// Validate form fields
export const validateForm = (data, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const value = data[field];
    const rules = schema[field];
    
    if (rules.required && isEmptyString(value)) {
      errors[field] = `${rules.label || field} is required`;
      return;
    }
    
    if (rules.email && value && !isValidEmail(value)) {
      errors[field] = `Please enter a valid email`;
      return;
    }
    
    if (rules.password && value && !isValidPassword(value)) {
      errors[field] = `Password must be at least 8 characters and contain at least one letter and one number`;
      return;
    }
    
    if (rules.phone && value && !isValidPhone(value)) {
      errors[field] = `Please enter a valid phone number`;
      return;
    }
    
    if (rules.minLength && value && value.length < rules.minLength) {
      errors[field] = `${rules.label || field} must be at least ${rules.minLength} characters`;
      return;
    }
    
    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors[field] = `${rules.label || field} must not exceed ${rules.maxLength} characters`;
      return;
    }
    
    if (rules.match && value !== data[rules.match]) {
      errors[field] = `${rules.label || field} does not match ${rules.matchLabel || rules.match}`;
      return;
    }
    
    if (rules.custom && rules.custom.validate && !rules.custom.validate(value)) {
      errors[field] = rules.custom.message || `Invalid ${rules.label || field}`;
      return;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
