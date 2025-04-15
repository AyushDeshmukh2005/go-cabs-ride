
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { Server: SocketServer } = require('socket.io');
const dotenv = require('dotenv');
const { initializeDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const rideRoutes = require('./routes/rides');
const emergencyRoutes = require('./routes/emergency');
const { verifyToken } = require('./middleware/auth');
const socketHandler = require('./socket/socketHandler');
const socketStore = require('./socket/socketStore');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Only initialize Socket.IO if it doesn't already exist
if (!global.io) {
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  
  // Make io available globally
  global.io = io;
  
  console.log('Socket.IO server initialized');
  
  // Setup Socket.IO
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Store socket information
    socket.on('authenticate', (userData) => {
      if (userData && userData.id) {
        socketStore.addSocket(userData.id, socket.id);
        console.log(`User ${userData.id} authenticated with socket ${socket.id}`);
        
        // Join user-specific room
        socket.join(`user_${userData.id}`);
        
        // Join role-specific room (e.g., 'driver', 'rider', 'admin')
        if (userData.role) {
          socket.join(userData.role);
          console.log(`User joined ${userData.role} room`);
        }
      }
    });
    
    // Setup other socket event handlers
    socketHandler.setupEventHandlers(socket, io);
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      socketStore.removeSocketId(socket.id);
    });
  });
} else {
  console.log('Using existing Socket.IO instance');
}

// Initialize database on server start
initializeDatabase().then(success => {
  if (success) {
    console.log('Database initialized successfully!');
  } else {
    console.error('Database initialization failed!');
  }
}).catch(error => {
  console.error('Error during database initialization:', error);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/rides', verifyToken, rideRoutes);
app.use('/api/emergency', verifyToken, emergencyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is running' });
});

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
