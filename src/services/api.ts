
import { toast } from "@/hooks/use-toast";
import { checkDatabaseConnection } from "@/utils/database";

// Use Vite's import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Define interfaces for API data types
export interface RideData {
  ride_type: string;
  passengers: number;
  preferences: {
    silent: boolean;
    music: boolean;
    ac: boolean;
  };
  pickup_address?: string;
  destination_address?: string;
  stops?: string[];
  is_scheduled?: boolean;
  scheduled_at?: string;
}

export interface EmergencyContact {
  id?: number;
  name: string;
  phone: string;
  relationship: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address?: string;
  preferences?: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
    silentRides: boolean;
    acAlwaysOn: boolean;
  }
}

export interface Address {
  id?: number;
  type: string;
  address: string;
  default?: boolean;
}

export interface ApiError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Check if we're using the mock mode (when backend is not available)
let useMockMode = false;

// Mock API responses for demonstration
const mockResponses = {
  '/rides': { 
    status: 'success', 
    message: 'Ride booked successfully',
    rideId: '12345',
    estimatedFare: '15.00',
    estimatedArrival: '5 min'
  },
  '/rides/history': [
    {
      id: 1,
      date: '2023-10-15',
      time: '2:30 PM',
      pickup: '123 Main St',
      destination: '456 Oak Ave',
      driver: 'John Doe',
      rating: 4.8,
      price: '$15.50',
      status: 'completed',
      carbon: '1.2 kg CO₂',
      paymentMethod: 'Credit Card'
    },
    {
      id: 2,
      date: '2023-10-10',
      time: '9:15 AM',
      pickup: '789 Pine St',
      destination: '321 Elm Rd',
      driver: 'Jane Smith',
      rating: 4.9,
      price: '$22.75',
      status: 'completed',
      carbon: '1.8 kg CO₂',
      paymentMethod: 'Cash'
    }
  ],
  '/rides/scheduled': [
    {
      id: 3,
      date: '2023-10-20',
      time: '10:00 AM',
      pickup: '123 Main St',
      destination: 'Airport Terminal B',
      price: '$35.00',
      status: 'scheduled'
    }
  ],
  '/rides/nearby-drivers': [
    { 
      id: 1, 
      name: 'John Doe', 
      vehicle: 'Toyota Camry', 
      rating: 4.8, 
      distanceAway: '2 mins',
      location: { lat: 19.0760, lng: 72.8777 }
    },
    { 
      id: 2, 
      name: 'Sarah Miller', 
      vehicle: 'Honda Civic', 
      rating: 4.9, 
      distanceAway: '3 mins',
      location: { lat: 19.0810, lng: 72.8818 }
    },
    { 
      id: 3, 
      name: 'Mike Wilson', 
      vehicle: 'Hyundai Sonata', 
      rating: 4.7, 
      distanceAway: '5 mins',
      location: { lat: 19.0710, lng: 72.8747 }
    }
  ],
  '/auth/verify': {
    status: 'success',
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'rider'
    }
  },
  '/users/profile': {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'en',
      silentRides: false,
      acAlwaysOn: true
    },
    payment_methods: [
      { id: 1, type: 'Credit Card', last4: '4821', isDefault: true },
      { id: 2, type: 'Cash', isDefault: false }
    ],
    emergencyContacts: [
      { id: 1, name: 'Emma Johnson', phone: '+1 (555) 987-6543', relationship: 'Spouse' }
    ],
    addresses: [
      { id: 1, type: 'Home', address: '123 Main Street, Apt 4B, New York, NY 10001', default: true },
      { id: 2, type: 'Work', address: '456 Business Ave, Suite 200, New York, NY 10018', default: false }
    ],
    favorites: [
      { id: 1, name: 'John Doe', rating: 4.9, trips: 5 },
      { id: 2, name: 'Sarah Williams', rating: 4.8, trips: 3 }
    ]
  },
  '/notifications': [
    {
      id: 1,
      title: 'Ride Completed',
      message: 'Your ride with John Doe has been completed. Rate your experience!',
      timestamp: '2023-10-15T14:30:00.000Z',
      read: true
    },
    {
      id: 2,
      title: 'Discount Available',
      message: 'Use code SAVE20 for 20% off your next ride!',
      timestamp: '2023-10-14T10:15:00.000Z',
      read: false
    },
    {
      id: 3,
      title: 'Driver Assigned',
      message: 'Jane Smith will be your driver for your upcoming ride.',
      timestamp: '2023-10-13T18:45:00.000Z',
      read: false
    }
  ],
  '/users/profile/update': {
    status: 'success',
    message: 'Profile updated successfully'
  },
  '/users/profile/emergency-contacts': [
    { id: 1, name: 'Emma Johnson', phone: '+1 (555) 987-6543', relationship: 'Spouse' }
  ],
  '/users/profile/emergency-contacts/add': {
    status: 'success',
    message: 'Emergency contact added successfully',
    contact: { id: 2, name: 'John Smith', phone: '+1 (555) 123-4567', relationship: 'Brother' }
  },
  '/users/profile/addresses': [
    { id: 1, type: 'Home', address: '123 Main Street, Apt 4B, New York, NY 10001', default: true },
    { id: 2, type: 'Work', address: '456 Business Ave, Suite 200, New York, NY 10018', default: false }
  ],
  '/users/profile/addresses/add': {
    status: 'success',
    message: 'Address added successfully',
    address: { id: 3, type: 'Gym', address: '789 Fitness Blvd, New York, NY 10001', default: false }
  },
  '/auth/register': {
    status: 'success',
    message: 'User registered successfully',
    token: 'mock-auth-token',
    user: {
      id: 2,
      name: 'New User',
      email: 'newuser@example.com',
      role: 'rider'
    }
  },
  '/auth/login': {
    status: 'success',
    message: 'Login successful',
    token: 'mock-auth-token',
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'rider'
    }
  }
};

async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // Format error message from API
    const message = data?.message || data?.error || "An error occurred";
    const error = new Error(message) as ApiError;
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function fetchApi(endpoint: string, options: {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  withAuth?: boolean;
  mockResponse?: any;
} = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    withAuth = true,
    mockResponse
  } = options;

  // Check database connection status which may enable mock mode
  await checkDatabaseConnection();
  
  // If mock mode is enabled or mockResponse is provided, return mock data
  if (useMockMode || mockResponse) {
    console.log('Using mock API response for:', endpoint);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (mockResponse) {
      return mockResponse;
    }
    
    // Return predefined mock response if available
    if (endpoint in mockResponses) {
      return mockResponses[endpoint as keyof typeof mockResponses];
    }
    
    // Default mock response
    return { status: 'success', message: 'Operation completed successfully (mock)' };
  }

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Add auth token if available and requested
  if (withAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    return await handleResponse(response);
  } catch (error) {
    if ((error as ApiError).status) {
      // Handle specific API errors
      if ((error as ApiError).status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      throw error;
    }
    
    // Network or other errors - switch to mock mode
    console.error('Network error. Enabling mock mode:', error);
    useMockMode = true;
    
    // Return mock response after switching to mock mode
    if (endpoint in mockResponses) {
      return mockResponses[endpoint as keyof typeof mockResponses];
    }
    
    // Default mock response
    return { status: 'success', message: 'Operation completed successfully (mock)' };
  }
}

// Simplified API service for various endpoints
const apiService = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      fetchApi("/auth/login", { method: "POST", body: credentials, withAuth: false }),
    
    register: (userData: any) =>
      fetchApi("/auth/register", { method: "POST", body: userData, withAuth: false }),
    
    verifyToken: () => 
      fetchApi("/auth/verify"),
      
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return Promise.resolve({ status: 'success', message: 'Logged out successfully' });
    }
  },
  
  rides: {
    getHistory: (params?: any) =>
      fetchApi("/rides/history", { method: "GET" }),
    
    getScheduled: () =>
      fetchApi("/rides/scheduled", { method: "GET" }),
    
    getById: (id: number) =>
      fetchApi(`/rides/${id}`),
    
    book: (rideData: RideData) =>
      fetchApi("/rides", { method: "POST", body: rideData }),
    
    bookAgain: (id: number) =>
      fetchApi(`/rides/${id}/book-again`, { method: "POST" }),
    
    cancel: (id: number) =>
      fetchApi(`/rides/${id}/cancel`, { method: "PUT" }),
    
    reschedule: (id: number, newData: any) =>
      fetchApi(`/rides/${id}/reschedule`, { method: "PUT", body: newData }),
    
    rate: (id: number, ratingData: any) =>
      fetchApi(`/rides/${id}/rating`, { method: "POST", body: ratingData }),
      
    getNearbyDrivers: () =>
      fetchApi("/rides/nearby-drivers", { method: "GET" })
  },
  
  user: {
    getProfile: () =>
      fetchApi("/users/profile"),
    
    updateProfile: (userData: UserProfile) =>
      fetchApi("/users/profile/update", { method: "PUT", body: userData }),
    
    getFavoriteDrivers: () =>
      fetchApi("/favorites/drivers"),
      
    addEmergencyContact: (contact: EmergencyContact) =>
      fetchApi("/users/profile/emergency-contacts/add", { method: "POST", body: contact }),
      
    getEmergencyContacts: () =>
      fetchApi("/users/profile/emergency-contacts"),
      
    addAddress: (address: Address) =>
      fetchApi("/users/profile/addresses/add", { method: "POST", body: address }),
      
    getAddresses: () =>
      fetchApi("/users/profile/addresses"),
      
    updatePreferences: (preferences: any) =>
      fetchApi("/users/profile/preferences", { method: "PUT", body: preferences })
  },
  
  notifications: {
    getAll: () =>
      fetchApi("/notifications"),
      
    markAsRead: (id: number) =>
      fetchApi(`/notifications/${id}/read`, { method: "PUT" }),
      
    markAllAsRead: () =>
      fetchApi("/notifications/read-all", { method: "PUT" })
  }
};

// Error handling utility that can be used with any API call
const handleApiError = (error: any, fallbackMessage: string = "Something went wrong") => {
  console.error("API Error:", error);
  
  if ((error as ApiError).status) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return error.message;
  }
  
  toast({
    title: "Error",
    description: fallbackMessage,
    variant: "destructive",
  });
  return fallbackMessage;
};

// Export enableMockMode function for testing and development
export const enableMockMode = (enable: boolean = true) => {
  useMockMode = enable;
  console.log(`Mock API mode ${enable ? 'enabled' : 'disabled'}`);
};

export { apiService, handleApiError };
