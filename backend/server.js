
import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import socketIo from 'socket.io';
import { initializeDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import rideRoutes from './routes/rides.js';
import emergencyRoutes from './routes/emergency.js';
import optimizationRoutes from './routes/optimization.js';
import subscriptionRoutes from './routes/subscriptions.js';
import { verifyToken } from './middleware/auth.js';
import socketHandler from './socket/socketHandler.js';
import * as socketStore from './socket/socketStore.js';

// Get the directory name using ESM compatible approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io available globally
global.io = io;

// Initialize database on server start
initializeDatabase().then(success => {
  if (success) {
    console.log('Database initialized successfully!');
  } else {
    console.error('Database initialization failed!');
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/rides', verifyToken, rideRoutes);
app.use('/api/emergency', verifyToken, emergencyRoutes);
app.use('/api/optimization', verifyToken, optimizationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is running' });
});

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'API is running' });
});

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

export { app, server, io };
