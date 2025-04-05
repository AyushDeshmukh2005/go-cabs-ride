
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gocabs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
    return false;
  }
};

// Initialize database - create tables if they don't exist
const initializeDatabase = async () => {
  try {
    // Check connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Failed to initialize database: connection failed');
      return false;
    }

    // Create tables using the SQL from schema.sql
    console.log('Creating/updating database tables...');
    
    // You can add table creation queries here
    // For example:
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('rider', 'driver', 'admin') NOT NULL DEFAULT 'rider',
        status ENUM('active', 'inactive', 'pending', 'blocked') NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
};
