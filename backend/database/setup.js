
import { pool, initializeDatabase } from '../config/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name using ESM compatible approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Check if the .env file exists and contains database configuration
const checkEnvConfig = () => {
  const envPath = path.resolve(__dirname, '../../.env');
  
  if (!fs.existsSync(envPath)) {
    console.error('\x1b[31mERROR: .env file not found!\x1b[0m');
    console.log('Please create a .env file in the project root with the following database configuration:');
    console.log(`
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=gocabs
JWT_SECRET=your_jwt_secret_key_here
    `);
    return false;
  }
  
  // Check for required database environment variables
  const requiredVars = ['DB_HOST', 'DB_USER', 'DB_NAME'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`\x1b[31mERROR: Missing required environment variables: ${missingVars.join(', ')}\x1b[0m`);
    return false;
  }
  
  return true;
};

const setupDatabase = async () => {
  console.log('Starting database setup...');
  
  // Check environment configuration first
  if (!checkEnvConfig()) {
    process.exit(1);
  }
  
  try {
    // Check if the database exists, if not create it
    const tempPool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 2,
      queueLimit: 0
    });
    
    // Try to create the database if it doesn't exist
    try {
      await tempPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      console.log(`Ensured database "${process.env.DB_NAME}" exists`);
    } catch (createError) {
      console.error('Error creating database:', createError);
      await tempPool.end();
      process.exit(1);
    }
    
    await tempPool.end();
    
    // Initialize database tables
    console.log('Initializing database tables...');
    const result = await initializeDatabase();
    
    if (result) {
      console.log('\x1b[32mDatabase setup completed successfully!\x1b[0m');
    } else {
      console.error('\x1b[31mDatabase setup failed. Check the error logs above.\x1b[0m');
    }
    
    // Close the pool
    await pool.end();
    
  } catch (error) {
    console.error('\x1b[31mAn unexpected error occurred during database setup:\x1b[0m', error);
  }
  
  process.exit();
};

// Run the setup if this file is executed directly
if (import.meta.url.startsWith('file:') && process.argv[1] === fileURLToPath(import.meta.url)) {
  setupDatabase();
}

export default setupDatabase;
