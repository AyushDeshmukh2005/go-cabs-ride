
// Store for mapping user IDs to socket IDs

// Maps: userId -> socketId
const userSocketMap = new Map();

// Maps: socketId -> userId
const socketUserMap = new Map();

/**
 * Add a socket to the store
 * @param {string} userId - The user ID
 * @param {string} socketId - The socket ID
 */
exports.addSocket = (userId, socketId) => {
  userSocketMap.set(userId.toString(), socketId);
  socketUserMap.set(socketId, userId.toString());
};

/**
 * Remove a socket by socket ID
 * @param {string} socketId - The socket ID to remove
 */
exports.removeSocketId = (socketId) => {
  const userId = socketUserMap.get(socketId);
  if (userId) {
    userSocketMap.delete(userId);
  }
  socketUserMap.delete(socketId);
};

/**
 * Remove a socket by user ID
 * @param {string} userId - The user ID to remove
 */
exports.removeUserId = (userId) => {
  const socketId = userSocketMap.get(userId.toString());
  if (socketId) {
    socketUserMap.delete(socketId);
  }
  userSocketMap.delete(userId.toString());
};

/**
 * Get socket ID by user ID
 * @param {string} userId - The user ID to look up
 * @returns {string|undefined} The socket ID if found
 */
exports.getSocketIdByUserId = (userId) => {
  return userSocketMap.get(userId.toString());
};

/**
 * Get user ID by socket ID
 * @param {string} socketId - The socket ID to look up
 * @returns {string|undefined} The user ID if found
 */
exports.getUserIdBySocketId = (socketId) => {
  return socketUserMap.get(socketId);
};

/**
 * Check if a user is connected
 * @param {string} userId - The user ID to check
 * @returns {boolean} True if the user has a socket connection
 */
exports.isUserConnected = (userId) => {
  return userSocketMap.has(userId.toString());
};

/**
 * Get all connected users
 * @returns {string[]} Array of user IDs
 */
exports.getAllConnectedUsers = () => {
  return Array.from(userSocketMap.keys());
};

/**
 * Get all active socket IDs
 * @returns {string[]} Array of socket IDs
 */
exports.getAllActiveSockets = () => {
  return Array.from(socketUserMap.keys());
};

/**
 * Get the number of connected users
 * @returns {number} Count of connected users
 */
exports.getConnectedUsersCount = () => {
  return userSocketMap.size;
};
