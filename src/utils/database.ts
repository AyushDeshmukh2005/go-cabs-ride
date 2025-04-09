import { toast } from "@/hooks/use-toast";

// Use Vite's import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connected: boolean = false;
  private connectionAttempts: number = 0;
  private readonly MAX_RETRIES = 3;

  private constructor() {
    this.initConnection();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private async initConnection(): Promise<void> {
    try {
      this.connectionAttempts++;
      
      // Simulate connection check with backend
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET'
      });
      
      if (response.ok) {
        console.log('Database connection successful');
        this.connected = true;
      } else {
        throw new Error('Failed to connect to database');
      }
    } catch (error) {
      console.error('Database connection error:', error);
      
      if (this.connectionAttempts <= this.MAX_RETRIES) {
        console.log(`Retrying connection... Attempt ${this.connectionAttempts} of ${this.MAX_RETRIES}`);
        setTimeout(() => this.initConnection(), 2000 * this.connectionAttempts);
      } else {
        toast({
          title: "Database Connection Error",
          description: "Could not connect to the database. Some features may not work properly.",
          variant: "destructive",
        });
      }
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public async reconnect(): Promise<void> {
    if (!this.isConnected()) {
      console.log('Attempting to reconnect to the database...');
      await this.initConnection();
    } else {
      console.log('Database is already connected.');
    }
  }
}

const dbConnection = DatabaseConnection.getInstance();

// Utility function to check database connection
export const checkDatabaseConnection = async () => {
  if (!dbConnection.isConnected()) {
    console.log('Database connection is not active. Attempting to reconnect...');
    await dbConnection.reconnect();
  } else {
    console.log('Database connection is active.');
  }
};

export default dbConnection;
