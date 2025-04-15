
import { pool, initializeDatabase } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const setupDatabase = async () => {
  console.log('Starting database setup...');
  
  try {
    // Initialize database tables
    const result = await initializeDatabase();
    
    if (result) {
      console.log('Database setup completed successfully!');
    } else {
      console.error('Database setup failed. Check the error logs above.');
    }
    
    // Close the pool
    await pool.end();
    
  } catch (error) {
    console.error('An unexpected error occurred during database setup:', error);
  }
  
  process.exit();
};

// Run the setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export default setupDatabase;
