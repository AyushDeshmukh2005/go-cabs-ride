
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configure database connection options
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gocabs',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: 0,
  connectTimeout: 10000,  // 10 seconds
  // Enable connection debugging for development
  debug: process.env.NODE_ENV === 'development' && process.env.DB_DEBUG === 'true' ? ['ComQueryPacket', 'RowDataPacket'] : false
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Enhanced error logger for database operations
const logDatabaseError = (operation, error, query = null, params = null) => {
  console.error(`Database ${operation} error:`, error);
  
  if (query) {
    console.error('Query:', query);
  }
  
  if (params) {
    // Sanitize sensitive data before logging
    const sanitizedParams = params.map(p => 
      typeof p === 'string' && (
        p.toLowerCase().includes('password') || 
        p.toLowerCase().includes('token') || 
        p.toLowerCase().includes('secret')
      ) ? '[REDACTED]' : p
    );
    console.error('Params:', sanitizedParams);
  }
  
  // Log connection info for connection errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('Connection failed. Please check:');
    console.error('1. MySQL server is running');
    console.error('2. Database credentials are correct');
    console.error('3. Network connectivity to database server');
    console.error('Database configuration:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
    });
  }
};

// Test the connection with enhanced logging
const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Connected to MySQL database successfully!');
    console.log('Database info:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      connectionLimit: dbConfig.connectionLimit,
    });
    
    // Test a simple query to verify full connectivity
    const [result] = await connection.query('SELECT 1 as testValue');
    if (result[0].testValue === 1) {
      console.log('Database query test successful');
    }
    
    return true;
  } catch (error) {
    logDatabaseError('connection', error);
    return false;
  } finally {
    if (connection) {
      connection.release();
    }
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

    console.log('Creating/updating database tables...');
    
    // Try to read schema from file first for better maintainability
    try {
      const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        // Split the schema by semicolons to execute each statement separately
        const statements = schema
          .split(';')
          .filter(statement => statement.trim())
          .map(statement => `${statement.trim()};`);
          
        for (const statement of statements) {
          await pool.query(statement);
        }
        
        console.log('Database schema applied from schema.sql file');
        return true;
      }
    } catch (schemaError) {
      console.error('Error applying schema from file:', schemaError);
      console.log('Falling back to hardcoded schema...');
    }
    
    // Create users table if not exists
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
    
    // Create riders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS riders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        rating DECIMAL(3,2) DEFAULT 5.00,
        subscription_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create drivers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS drivers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        license_number VARCHAR(50) NOT NULL,
        vehicle_make VARCHAR(50) NOT NULL,
        vehicle_model VARCHAR(50) NOT NULL,
        vehicle_year INT NOT NULL,
        vehicle_color VARCHAR(30) NOT NULL,
        vehicle_plate VARCHAR(20) NOT NULL,
        rating DECIMAL(3,2) DEFAULT 5.00,
        is_active BOOLEAN DEFAULT FALSE,
        is_verified BOOLEAN DEFAULT FALSE,
        current_location_lat DECIMAL(10, 8),
        current_location_lng DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create payment_methods table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        payment_type VARCHAR(50) NOT NULL,
        provider VARCHAR(50) NOT NULL,
        account_number VARCHAR(255) NOT NULL,
        expiry_date VARCHAR(10),
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create rides table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rider_id INT NOT NULL,
        driver_id INT,
        pickup_lat DECIMAL(10, 8) NOT NULL,
        pickup_lng DECIMAL(11, 8) NOT NULL,
        pickup_address VARCHAR(255) NOT NULL,
        destination_lat DECIMAL(10, 8) NOT NULL,
        destination_lng DECIMAL(11, 8) NOT NULL,
        destination_address VARCHAR(255) NOT NULL,
        status ENUM('pending', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
        ride_type ENUM('standard', 'premium', 'eco') DEFAULT 'standard',
        estimated_fare DECIMAL(10, 2) NOT NULL,
        final_fare DECIMAL(10, 2),
        distance_km DECIMAL(8, 2),
        duration_minutes INT,
        payment_method_id INT,
        payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        rider_rating DECIMAL(3, 2),
        driver_rating DECIMAL(3, 2),
        carbon_footprint DECIMAL(8, 2),
        scheduled_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (rider_id) REFERENCES riders(id),
        FOREIGN KEY (driver_id) REFERENCES drivers(id),
        FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
      )
    `);
    
    // Create emergency_contacts table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS emergency_contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        contact_name VARCHAR(100) NOT NULL,
        contact_phone VARCHAR(20) NOT NULL,
        contact_relationship VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create activity_logs table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        activity_type VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    
    console.log('Database initialized successfully!');
    return true;
  } catch (error) {
    logDatabaseError('initialization', error);
    return false;
  }
};

// Utility function to handle DB query errors with proper logging
const executeQuery = async (query, params = []) => {
  try {
    console.log(`Executing query: ${query.substring(0, 100)}${query.length > 100 ? '...' : ''}`);
    const startTime = Date.now();
    
    const [results] = await pool.query(query, params);
    
    const duration = Date.now() - startTime;
    if (duration > 1000) {
      console.warn(`Slow query detected (${duration}ms): ${query.substring(0, 100)}...`);
    }
    
    return results;
  } catch (error) {
    logDatabaseError('query', error, query, params);
    throw error;
  }
};

// Add a ping method to check if connection is still alive
const pingDatabase = async () => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    logDatabaseError('ping', error);
    return false;
  }
};

// Add graceful shutdown
process.on('SIGINT', async () => {
  try {
    console.log('Closing database connection pool...');
    await pool.end();
    console.log('Database connection pool closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing database pool:', err);
    process.exit(1);
  }
});

module.exports = {
  pool,
  initializeDatabase,
  testConnection,
  executeQuery,
  pingDatabase
};
