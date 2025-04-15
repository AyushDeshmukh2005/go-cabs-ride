
// Socket event handlers

/**
 * Setup event handlers for a socket connection
 * @param {Object} socket - The socket.io socket object
 * @param {Object} io - The socket.io server instance
 */
const setupEventHandlers = (socket, io) => {
  // Handle ride status updates
  socket.on('join_ride', (rideId) => {
    if (rideId) {
      socket.join(`ride_${rideId}`);
      console.log(`Socket ${socket.id} joined ride_${rideId} room`);
    }
  });
  
  socket.on('leave_ride', (rideId) => {
    if (rideId) {
      socket.leave(`ride_${rideId}`);
      console.log(`Socket ${socket.id} left ride_${rideId} room`);
    }
  });
  
  // Handle driver location updates
  socket.on('update_driver_location', (data) => {
    if (data && data.driverId && data.location) {
      // Broadcast to any clients tracking this driver
      io.to(`track_driver_${data.driverId}`).emit('driver_location_updated', {
        driverId: data.driverId,
        location: data.location,
        timestamp: new Date()
      });
      
      // If this is part of a ride, broadcast to the ride room
      if (data.rideId) {
        io.to(`ride_${data.rideId}`).emit('driver_location_updated', {
          driverId: data.driverId,
          location: data.location,
          timestamp: new Date()
        });
      }
    }
  });
  
  // Handle tracking specific drivers
  socket.on('track_driver', (driverId) => {
    if (driverId) {
      socket.join(`track_driver_${driverId}`);
      console.log(`Socket ${socket.id} is now tracking driver ${driverId}`);
    }
  });
  
  socket.on('stop_tracking_driver', (driverId) => {
    if (driverId) {
      socket.leave(`track_driver_${driverId}`);
      console.log(`Socket ${socket.id} stopped tracking driver ${driverId}`);
    }
  });
  
  // Handle user presence
  socket.on('user_online', (userId) => {
    if (userId) {
      // Update user status in memory
      io.userStatus = io.userStatus || {};
      io.userStatus[userId] = 'online';
      
      // Broadcast to those interested in this user's status
      io.to(`user_status_${userId}`).emit('user_status_changed', {
        userId,
        status: 'online',
        timestamp: new Date()
      });
    }
  });
  
  socket.on('user_offline', (userId) => {
    if (userId) {
      // Update user status in memory
      io.userStatus = io.userStatus || {};
      io.userStatus[userId] = 'offline';
      
      // Broadcast to those interested in this user's status
      io.to(`user_status_${userId}`).emit('user_status_changed', {
        userId,
        status: 'offline',
        timestamp: new Date()
      });
    }
  });
  
  // Handle direct messages
  socket.on('send_message', (data) => {
    if (data && data.recipientId && data.message) {
      // Send to recipient's personal room
      io.to(`user_${data.recipientId}`).emit('receive_message', {
        senderId: data.senderId,
        senderName: data.senderName,
        message: data.message,
        timestamp: new Date()
      });
    }
  });
  
  // Handle emergency broadcasts
  socket.on('emergency_broadcast', (data) => {
    if (data && data.userId && data.location) {
      // Broadcast to admin room
      io.to('admin').emit('emergency_alert', {
        userId: data.userId,
        userName: data.userName,
        location: data.location,
        message: data.message || 'Emergency alert!',
        timestamp: new Date()
      });
      
      // If part of a ride, broadcast to the ride room
      if (data.rideId) {
        io.to(`ride_${data.rideId}`).emit('emergency_alert', {
          userId: data.userId,
          userName: data.userName,
          location: data.location,
          message: data.message || 'Emergency alert!',
          timestamp: new Date()
        });
      }
    }
  });
};

module.exports = {
  setupEventHandlers
};
