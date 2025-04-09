import { toast } from "@/hooks/use-toast";

// Use Vite's import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  withAuth?: boolean;
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
  } = options;

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
    // Network or other errors
    throw new ApiError(
      "Network error. Please check your connection.",
      0,
      error
    );
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

export { apiService, handleApiError, ApiError };
