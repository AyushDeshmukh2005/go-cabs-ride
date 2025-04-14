
import { toast } from "@/hooks/use-toast";
import { enableMockMode } from "@/services/api";

// Use Vite's import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connected: boolean = false;
  private connectionAttempts: number = 0;
  private readonly MAX_RETRIES = 3;
  private connectionPromise: Promise<boolean> | null = null;

  private constructor() {
    this.initConnection();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private async initConnection(): Promise<boolean> {
    try {
      this.connectionAttempts++;
      console.log(`Attempting database connection (Attempt ${this.connectionAttempts}/${this.MAX_RETRIES})`);
      
      // Check connection with backend health endpoint
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('Database connection successful');
        this.connected = true;
        enableMockMode(false); // Disable mock mode when connected
        return true;
      } else {
        throw new Error('Failed to connect to database');
      }
    } catch (error) {
      console.error('Database connection error:', error);
      
      if (this.connectionAttempts <= this.MAX_RETRIES) {
        console.log(`Retrying connection... Attempt ${this.connectionAttempts} of ${this.MAX_RETRIES}`);
        
        // Set a timeout before retrying
        await new Promise(resolve => setTimeout(resolve, 2000 * this.connectionAttempts));
        
        // Try again recursively
        return this.initConnection();
      } else {
        toast({
          title: "Database Connection Notice",
          description: "Using demo mode with sample data. Your experience won't be affected.",
          variant: "default",
        });
        
        // For demo purposes, we can pretend to be connected to allow functionality to work
        this.connected = true;
        enableMockMode(true); // Enable mock mode when connection fails
        console.log('Using mock database mode for demonstration purposes');
        return false;
      }
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public async ensureConnected(): Promise<boolean> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }
    
    if (this.connected) {
      return Promise.resolve(true);
    }
    
    this.connectionPromise = this.initConnection();
    const result = await this.connectionPromise;
    this.connectionPromise = null;
    return result;
  }

  public async reconnect(): Promise<boolean> {
    if (!this.isConnected()) {
      console.log('Attempting to reconnect to the database...');
      this.connectionAttempts = 0; // Reset attempts counter for reconnection
      return this.initConnection();
    } else {
      console.log('Database is already connected.');
      return true;
    }
  }
}

const dbConnection = DatabaseConnection.getInstance();

// Utility function to check database connection
export const checkDatabaseConnection = async (): Promise<boolean> => {
  if (!dbConnection.isConnected()) {
    console.log('Database connection is not active. Attempting to reconnect...');
    return await dbConnection.ensureConnected();
  } else {
    console.log('Database connection is active.');
    return true;
  }
};

export default dbConnection;
