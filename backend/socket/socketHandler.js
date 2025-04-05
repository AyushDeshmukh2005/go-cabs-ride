
const { addUserToSocket, removeUserFromSocket, getUsersBySocketId, getSocketIdByUserId } = require('./socketStore');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User authentication and identification
    socket.on('authenticate', ({ userId, role }) => {
      if (userId) {
        addUserToSocket(socket.id, userId, role);
        socket.join(`user_${userId}`);
        socket.join(role === 'driver' ? 'drivers' : 'riders');
        console.log(`User ${userId} authenticated as ${role}`);
      }
    });

    // Join a specific ride room for tracking and messages
    socket.on('join_ride', (rideId) => {
      if (rideId) {
        socket.join(`ride_${rideId}`);
        console.log(`Socket ${socket.id} joined ride ${rideId}`);
      }
    });

    // Leave a ride room
    socket.on('leave_ride', (rideId) => {
      if (rideId) {
        socket.leave(`ride_${rideId}`);
        console.log(`Socket ${socket.id} left ride ${rideId}`);
      }
    });

    // Location updates
    socket.on('location_update', (data) => {
      const { rideId, location, userId } = data;
      if (rideId && location) {
        io.to(`ride_${rideId}`).emit('location_update', {
          userId,
          location,
          timestamp: new Date()
        });
      }
    });

    // Chat messages
    socket.on('send_message', (data) => {
      const { rideId, senderId, receiverId, message } = data;
      if (rideId && senderId && receiverId && message) {
        io.to(`ride_${rideId}`).emit('receive_message', {
          senderId,
          message,
          timestamp: new Date()
        });
        
        // Also send to specific user if they're not in the ride room
        const receiverSocketId = getSocketIdByUserId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', {
            rideId,
            senderId,
            message,
            timestamp: new Date()
          });
        }
      }
    });

    // Fare negotiation
    socket.on('fare_offer', (data) => {
      const { rideId, userId, role, amount, message } = data;
      if (rideId) {
        io.to(`ride_${rideId}`).emit('fare_update', {
          userId,
          role,
          amount,
          message,
          timestamp: new Date()
        });
      }
    });

    // Emergency alert
    socket.on('emergency_alert', (data) => {
      const { rideId, userId, location, emergencyType } = data;
      // Notify admin and emergency contacts
      io.to('admin').emit('emergency_alert', {
        rideId,
        userId,
        location,
        emergencyType,
        timestamp: new Date()
      });
      
      // Notify everyone in the ride
      if (rideId) {
        io.to(`ride_${rideId}`).emit('emergency_alert', {
          emergencyType,
          message: 'Emergency reported. Help is on the way.',
          timestamp: new Date()
        });
      }
    });

    // Ride status updates
    socket.on('ride_status_update', (data) => {
      const { rideId, status, updateBy } = data;
      if (rideId) {
        io.to(`ride_${rideId}`).emit('ride_status_changed', {
          status,
          updateBy,
          timestamp: new Date()
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const user = getUsersBySocketId(socket.id);
      if (user) {
        console.log(`User ${user.userId} disconnected`);
      } else {
        console.log('Client disconnected:', socket.id);
      }
      removeUserFromSocket(socket.id);
    });
  });
};

module.exports = { socketHandler };
