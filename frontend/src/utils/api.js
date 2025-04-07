
import axios from 'axios';
import { toast } from 'react-toastify';

// Create an axios instance with default configs
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Display error message
    toast.error(message);
    
    // Redirect to login if unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Create reusable API methods
const apiService = {
  // Auth related endpoints
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    verifyToken: () => api.get('/auth/verify')
  },
  
  // User related endpoints
  users: {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (userData) => api.put('/users/profile', userData),
    getById: (id) => api.get(`/users/${id}`),
    getFavoriteDrivers: () => api.get('/favorites/drivers')
  },
  
  // Ride related endpoints
  rides: {
    book: (rideData) => api.post('/rides', rideData),
    getHistory: (params) => api.get('/rides/history', { params }),
    getById: (id) => api.get(`/rides/${id}`),
    cancel: (id) => api.put(`/rides/${id}/cancel`),
    rate: (id, ratingData) => api.post(`/rides/${id}/rating`, ratingData)
  },
  
  // Driver related endpoints
  driver: {
    updateStatus: (status) => api.put('/driver/status', { status }),
    getRequests: () => api.get('/driver/requests'),
    acceptRide: (rideId) => api.put(`/driver/rides/${rideId}/accept`),
    completeRide: (rideId, rideData) => api.put(`/driver/rides/${rideId}/complete`, rideData)
  },
  
  // Admin related endpoints
  admin: {
    getStats: () => api.get('/admin/stats'),
    getUsers: (params) => api.get('/admin/users', { params }),
    getRides: (params) => api.get('/admin/rides', { params })
  }
};

export default apiService;
