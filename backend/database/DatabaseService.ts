
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  connectionLimit?: number;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private pool: mysql.Pool;

  private constructor(config: DatabaseConfig) {
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

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      const config: DatabaseConfig = {
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

  public async testConnection(): Promise<boolean> {
    try {
      const connection = await this.pool.getConnection();
      console.log('Connected to MySQL database successfully!');
      connection.release();
      return true;
    } catch (error) {
      console.error('Error connecting to MySQL database:', error);
      return false;
    }
  }

  public async query<T>(sql: string, params?: any[]): Promise<T> {
    try {
      const [results] = await this.pool.execute(sql, params);
      return results as T;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

export default DatabaseService;
