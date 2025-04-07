
import { useState } from 'react';
import { toast } from 'react-toastify';

const useFormValidation = (initialValues, validationSchema, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Use the appropriate value based on input type
    const inputValue = type === 'checkbox' ? checked : value;
    
    setValues({
      ...values,
      [name]: inputValue
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate a single field
  const validateField = (name, value) => {
    if (!validationSchema[name]) return '';
    
    const rules = validationSchema[name];
    
    // Check required
    if (rules.required && (!value || value.trim() === '')) {
      return `${rules.label || name} is required`;
    }
    
    // Check email format
    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    
    // Check minimum length
    if (rules.minLength && value && value.length < rules.minLength) {
      return `${rules.label || name} must be at least ${rules.minLength} characters`;
    }
    
    // Check maximum length
    if (rules.maxLength && value && value.length > rules.maxLength) {
      return `${rules.label || name} must not exceed ${rules.maxLength} characters`;
    }
    
    // Check pattern
    if (rules.pattern && value && !rules.pattern.test(value)) {
      return rules.patternMessage || `Invalid ${rules.label || name} format`;
    }
    
    // Check if matches another field
    if (rules.matches && value !== values[rules.matches]) {
      return `${rules.label || name} does not match ${rules.matchLabel || rules.matches}`;
    }
    
    // Custom validation
    if (rules.validate && typeof rules.validate === 'function') {
      const customError = rules.validate(value, values);
      if (customError) {
        return customError;
      }
    }
    
    return '';
  };

  // Validate all fields
  const validateForm = () => {
    const formErrors = {};
    let isValid = true;
    
    Object.keys(validationSchema).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        formErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(formErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validate form
    const isValid = validateForm();
    
    if (!isValid) {
      // Show first error
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Handle validation errors from API
      if (error.response && error.response.data && error.response.data.errors) {
        const apiErrors = {};
        
        error.response.data.errors.forEach(err => {
          apiErrors[err.field] = err.message;
        });
        
        setErrors(apiErrors);
        
        // Show first error
        const firstError = error.response.data.errors[0];
        if (firstError) {
          toast.error(firstError.message);
        }
      } else {
        // General error message
        toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  // Blur handler for field validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setErrors({
      ...errors,
      [name]: error
    });
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues
  };
};

export default useFormValidation;
