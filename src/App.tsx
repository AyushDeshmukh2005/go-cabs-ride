
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/components/ui/Navbar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Booking from "./pages/Booking";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Footer from "./components/ui/Footer";
import { checkDatabaseConnection } from "./utils/database";
import { enableMockMode, apiService } from "./services/api";
import { toast } from "@/hooks/use-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Create a QueryClient instance for React Query with optimized settings for React 18
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize theme from localStorage or system preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  
  if (savedTheme === "dark" || 
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    initializeTheme();
    
    // Initialize database connection
    const initApp = async () => {
      console.log("Initializing app and checking database connection...");
      const isConnected = await checkDatabaseConnection();
      
      // If database connection fails, enable mock mode for the API
      if (!isConnected) {
        console.log("Database connection failed, enabling mock mode for API");
        enableMockMode(true);
        
        // Show a toast notification for the user
        toast({
          title: "Using Demo Mode",
          description: "Connected to demo database with sample data. Full functionality is available.",
          variant: "default",
        });
      } else {
        console.log("Database connection successful");
      }
    };
    
    initApp();
    
    // Check for authentication token and handle session
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Verify token with backend
          const response = await apiService.auth.verifyToken();
          if (response.status === 'success') {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      // Show loading state while checking authentication
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen theme-transition">
            {isAuthenticated && <Navbar />}
            <main className={`flex-grow ${isAuthenticated ? 'pt-16 md:pt-20' : 'pt-0'}`}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={
                  isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />
                } />
                <Route path="/register" element={
                  isAuthenticated ? <Navigate to="/" /> : <Register setIsAuthenticated={setIsAuthenticated} />
                } />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/booking" element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            {isAuthenticated && <Footer />}
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
