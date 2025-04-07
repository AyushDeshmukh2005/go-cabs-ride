
import { renderHook, act } from '@testing-library/react-hooks';
import useFormValidation from '../hooks/useFormValidation';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn()
  }
}));

describe('useFormValidation Hook', () => {
  const initialValues = {
    name: '',
    email: '',
    password: ''
  };
  
  const validationSchema = {
    name: {
      required: true,
      label: 'Name',
      minLength: 2
    },
    email: {
      required: true,
      label: 'Email',
      email: true
    },
    password: {
      required: true,
      label: 'Password',
      minLength: 8,
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
      patternMessage: 'Password must contain at least one letter and one number'
    }
  };
  
  const mockSubmit = jest.fn();

  test('should initialize with initial values and empty errors', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationSchema, mockSubmit)
    );
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  test('should update values when handleChange is called', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationSchema, mockSubmit)
    );
    
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' }
      });
    });
    
    expect(result.current.values.name).toBe('John Doe');
  });

  test('should handle checkbox inputs correctly', () => {
    const { result } = renderHook(() => 
      useFormValidation({ ...initialValues, remember: false }, validationSchema, mockSubmit)
    );
    
    act(() => {
      result.current.handleChange({
        target: { name: 'remember', type: 'checkbox', checked: true }
      });
    });
    
    expect(result.current.values.remember).toBe(true);
  });

  test('should validate required fields on blur', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationSchema, mockSubmit)
    );
    
    act(() => {
      result.current.handleBlur({
        target: { name: 'name', value: '' }
      });
    });
    
    expect(result.current.errors.name).toBe('Name is required');
  });

  test('should validate email format on blur', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationSchema, mockSubmit)
    );
    
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'invalid-email' }
      });
      
      result.current.handleBlur({
        target: { name: 'email', value: 'invalid-email' }
      });
    });
    
    expect(result.current.errors.email).toBe('Please enter a valid email address');
  });

  test('should validate password requirements on blur', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationSchema, mockSubmit)
    );
    
    act(() => {
      result.current.handleChange({
        target: { name: 'password', value: 'short' }
      });
      
      result.current.handleBlur({
        target: { name: 'password', value: 'short' }
      });
    });
    
    expect(result.current.errors.password).toBe('Password must be at least 8 characters');
    
    act(() => {
      result.current.handleChange({
        target: { name: 'password', value: 'longpassword' }
      });
      
      result.current.handleBlur({
        target: { name: 'password', value: 'longpassword' }
      });
    });
    
    expect(result.current.errors.password).toBe('Password must contain at least one letter and one number');
  });

  test('should call onSubmit when form is valid', async () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationSchema, mockSubmit)
    );
    
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' }
      });
      
      result.current.handleChange({
        target: { name: 'email', value: 'john@example.com' }
      });
      
      result.current.handleChange({
        target: { name: 'password', value: 'Password123' }
      });
    });
    
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() });
    });
    
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123'
    });
  });

  test('should reset form when resetForm is called', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, validationSchema, mockSubmit)
    );
    
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' }
      });
      
      result.current.setValues({
        ...result.current.values,
        email: 'john@example.com'
      });
    });
    
    expect(result.current.values.name).toBe('John Doe');
    expect(result.current.values.email).toBe('john@example.com');
    
    act(() => {
      result.current.resetForm();
    });
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
  });
});
