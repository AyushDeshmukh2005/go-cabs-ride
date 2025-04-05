
const { pool, initializeDatabase } = require('../config/database');
require('dotenv').config();

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
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
