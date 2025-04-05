
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // Only connect socket if user is logged in
    if (user && user.id) {
      const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket'],
        auth: {
          token: localStorage.getItem('token')
        }
      });
      
      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        
        // Authenticate user with socket
        newSocket.emit('authenticate', {
          userId: user.id,
          role: user.role
        });
      });
      
      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });
      
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });
      
      // Handle ride updates
      newSocket.on('ride_update', (data) => {
        console.log('Ride update received:', data);
        toast.info(data.message);
      });
      
      // Handle ride status changes
      newSocket.on('ride_status_changed', (data) => {
        console.log('Ride status changed:', data);
        toast.info(`Ride status changed to ${data.status}`);
      });
      
      // Handle account updates
      newSocket.on('account_update', (data) => {
        console.log('Account update received:', data);
        if (data.type === 'block') {
          toast.error(data.message);
        } else {
          toast.success(data.message);
        }
      });
      
      // Handle emergency alerts
      newSocket.on('emergency_alert', (data) => {
        console.log('Emergency alert received:', data);
        toast.error(data.message, {
          autoClose: false,
          closeButton: true
        });
      });
      
      setSocket(newSocket);
      
      // Cleanup function
      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }
  }, [user]);
  
  // Join a ride room to receive updates for a specific ride
  const joinRideRoom = (rideId) => {
    if (socket && rideId) {
      socket.emit('join_ride', rideId);
      console.log(`Joined ride room for ride ${rideId}`);
    }
  };
  
  // Leave a ride room
  const leaveRideRoom = (rideId) => {
    if (socket && rideId) {
      socket.emit('leave_ride', rideId);
      console.log(`Left ride room for ride ${rideId}`);
    }
  };
  
  // Send location update
  const sendLocationUpdate = (rideId, location) => {
    if (socket && rideId && location) {
      socket.emit('location_update', {
        rideId,
        location,
        userId: user?.id
      });
    }
  };
  
  // Send chat message
  const sendMessage = (rideId, receiverId, message) => {
    if (socket && rideId && receiverId && message) {
      socket.emit('send_message', {
        rideId,
        senderId: user?.id,
        receiverId,
        message
      });
      return true;
    }
    return false;
  };
  
  // Send emergency alert
  const sendEmergencyAlert = (rideId, location, emergencyType, message) => {
    if (socket && rideId && location) {
      socket.emit('emergency_alert', {
        rideId,
        userId: user?.id,
        location,
        emergencyType,
        message
      });
      return true;
    }
    return false;
  };
  
  // Send fare negotiation offer
  const sendFareOffer = (rideId, amount, message) => {
    if (socket && rideId && amount) {
      socket.emit('fare_offer', {
        rideId,
        userId: user?.id,
        role: user?.role,
        amount,
        message
      });
      return true;
    }
    return false;
  };
  
  // Update ride status
  const updateRideStatus = (rideId, status) => {
    if (socket && rideId && status) {
      socket.emit('ride_status_update', {
        rideId,
        status,
        updateBy: user?.id
      });
      return true;
    }
    return false;
  };
  
  return (
    <SocketContext.Provider 
      value={{
        socket,
        isConnected,
        joinRideRoom,
        leaveRideRoom,
        sendLocationUpdate,
        sendMessage,
        sendEmergencyAlert,
        sendFareOffer,
        updateRideStatus
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
