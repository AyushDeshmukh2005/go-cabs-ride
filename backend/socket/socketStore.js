
// In-memory store for socket connections
const socketStore = {
  // Map of socketId -> { userId, role }
  socketToUser: new Map(),
  // Map of userId -> socketId
  userToSocket: new Map()
};

// Add a user to the socket store
const addUserToSocket = (socketId, userId, role) => {
  socketStore.socketToUser.set(socketId, { userId, role });
  socketStore.userToSocket.set(userId, socketId);
};

// Remove a user from the socket store
const removeUserFromSocket = (socketId) => {
  const user = socketStore.socketToUser.get(socketId);
  if (user) {
    socketStore.userToSocket.delete(user.userId);
    socketStore.socketToUser.delete(socketId);
  }
};

// Get a user by socket ID
const getUsersBySocketId = (socketId) => {
  return socketStore.socketToUser.get(socketId);
};

// Get socket ID by user ID
const getSocketIdByUserId = (userId) => {
  return socketStore.userToSocket.get(userId);
};

// Get all connected drivers
const getAllConnectedDrivers = () => {
  const drivers = [];
  socketStore.socketToUser.forEach((user, socketId) => {
    if (user.role === 'driver') {
      drivers.push({ socketId, userId: user.userId });
    }
  });
  return drivers;
};

// Get all connected users
const getAllConnectedUsers = () => {
  return Array.from(socketStore.socketToUser.entries()).map(([socketId, user]) => ({
    socketId,
    userId: user.userId,
    role: user.role
  }));
};

module.exports = {
  addUserToSocket,
  removeUserFromSocket,
  getUsersBySocketId,
  getSocketIdByUserId,
  getAllConnectedDrivers,
  getAllConnectedUsers
};
