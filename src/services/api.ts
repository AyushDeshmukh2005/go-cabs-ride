
import { toast } from "@/hooks/use-toast";
import { checkDatabaseConnection } from "@/utils/database";

// Use Vite's import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  withAuth?: boolean;
  mockResponse?: any; // For demonstration when backend is not available
}

class ApiError extends Error {
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
      language: 'en'
    },
    payment_methods: [
      { id: 1, type: 'Credit Card', last4: '4821', isDefault: true },
      { id: 2, type: 'Cash', isDefault: false }
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
  ]
};

async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // Format error message from API
    const message = data?.message || data?.error || "An error occurred";
    throw new ApiError(message, response.status, data);
  }

  return data;
}

async function fetchApi(endpoint: string, options: ApiOptions = {}) {
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
    if (error instanceof ApiError) {
      // Handle specific API errors
      if (error.status === 401) {
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
      fetchApi("/auth/verify")
  },
  
  rides: {
    getHistory: (params?: any) =>
      fetchApi("/rides/history", { method: "GET" }),
    
    getScheduled: () =>
      fetchApi("/rides/scheduled", { method: "GET" }),
    
    getById: (id: number) =>
      fetchApi(`/rides/${id}`),
    
    book: (rideData: any) =>
      fetchApi("/rides", { method: "POST", body: rideData }),
    
    bookAgain: (id: number) =>
      fetchApi(`/rides/${id}/book-again`, { method: "POST" }),
    
    cancel: (id: number) =>
      fetchApi(`/rides/${id}/cancel`, { method: "PUT" }),
    
    reschedule: (id: number, newData: any) =>
      fetchApi(`/rides/${id}/reschedule`, { method: "PUT", body: newData }),
    
    rate: (id: number, ratingData: any) =>
      fetchApi(`/rides/${id}/rating`, { method: "POST", body: ratingData })
  },
  
  user: {
    getProfile: () =>
      fetchApi("/users/profile"),
    
    updateProfile: (userData: any) =>
      fetchApi("/users/profile", { method: "PUT", body: userData }),
    
    getFavoriteDrivers: () =>
      fetchApi("/favorites/drivers")
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
  
  if (error instanceof ApiError) {
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

export { apiService, handleApiError, ApiError };
