
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RiderDashboard from './pages/rider/Dashboard';
import DriverDashboard from './pages/driver/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import RideBooking from './pages/rider/RideBooking';
import RideHistory from './pages/rider/RideHistory';
import Profile from './pages/Profile';
import RideDetail from './pages/rider/RideDetail';
import FavoriteRoutes from './pages/rider/FavoriteRoutes';
import Subscriptions from './pages/rider/Subscriptions';
import ChatPage from './pages/ChatPage';
import EmergencyContacts from './pages/rider/EmergencyContacts';
import AdminUsers from './pages/admin/Users';
import AdminRides from './pages/admin/Rides';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import NotFound from './pages/NotFound';

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === 'rider') {
      return <Navigate to="/rider/dashboard" />;
    } else if (user.role === 'driver') {
      return <Navigate to="/driver/dashboard" />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/" />;
  }
  
  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rider Routes */}
              <Route 
                path="/rider/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['rider']}>
                    <RiderDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rider/book" 
                element={
                  <ProtectedRoute allowedRoles={['rider']}>
                    <RideBooking />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rider/history" 
                element={
                  <ProtectedRoute allowedRoles={['rider']}>
                    <RideHistory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rider/rides/:id" 
                element={
                  <ProtectedRoute allowedRoles={['rider']}>
                    <RideDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rider/favorites" 
                element={
                  <ProtectedRoute allowedRoles={['rider']}>
                    <FavoriteRoutes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rider/subscriptions" 
                element={
                  <ProtectedRoute allowedRoles={['rider']}>
                    <Subscriptions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rider/emergency-contacts" 
                element={
                  <ProtectedRoute allowedRoles={['rider']}>
                    <EmergencyContacts />
                  </ProtectedRoute>
                } 
              />
              
              {/* Driver Routes */}
              <Route 
                path="/driver/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <DriverDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/rides" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminRides />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/reports" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminReports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Shared Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat/:rideId" 
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <ToastContainer position="top-right" autoClose={5000} />
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
