
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseService {
  static instance;
  
  constructor(config) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: config.connectionLimit || 10,
      queueLimit: 0
    });
  }

  static getInstance() {
    if (!DatabaseService.instance) {
      const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'gocabs',
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10')
      };
      
      DatabaseService.instance = new DatabaseService(config);
    }
    
    return DatabaseService.instance;
  }

  async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      console.log('Connected to MySQL database successfully!');
      connection.release();
      return true;
    } catch (error) {
      console.error('Error connecting to MySQL database:', error);
      console.error('DB Configuration:', {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        database: process.env.DB_NAME || 'gocabs',
      });
      return false;
    }
  }

  async query(sql, params) {
    try {
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Error executing query:', error);
      console.error('Query:', sql);
      console.error('Params:', params);
      throw error;
    }
  }

  async close() {
    await this.pool.end();
  }
}

export default DatabaseService;
