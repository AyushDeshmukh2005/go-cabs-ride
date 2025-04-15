
import { toast } from "@/hooks/use-toast";
import { enableMockMode } from "@/services/api";

// Use Vite's import.meta.env instead of process.env and adjust the API URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

class DatabaseConnection {
  static instance;
  connected = false;
  connectionAttempts = 0;
  MAX_RETRIES = 3;
  connectionPromise = null;
  mockModeEnabled = false;

  constructor() {
    this.initConnection();
  }

  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async initConnection() {
    try {
      this.connectionAttempts++;
      console.log(`Attempting database connection (Attempt ${this.connectionAttempts}/${this.MAX_RETRIES})`);
      
      // Check connection with backend health endpoint
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add a timeout to prevent hanging requests
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        console.log('Database connection successful');
        this.connected = true;
        
        // If we were previously in mock mode but now connection is successful, disable mock mode
        if (this.mockModeEnabled) {
          console.log('Switching from mock mode to live database connection');
          this.mockModeEnabled = false;
          enableMockMode(false);
        }
        
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to connect to database: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
      }
    } catch (error) {
      console.error('Database connection error:', error);
      
      // More detailed logging
      if (error.name === 'AbortError') {
        console.error('Connection attempt timed out after 5 seconds');
      } else if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error('Network error: Unable to reach the backend server. Please check if the server is running.');
      }
      
      if (this.connectionAttempts <= this.MAX_RETRIES) {
        console.log(`Retrying connection... Attempt ${this.connectionAttempts} of ${this.MAX_RETRIES}`);
        
        // Set a timeout before retrying with exponential backoff
        const backoffTime = Math.min(1000 * Math.pow(2, this.connectionAttempts - 1), 10000);
        console.log(`Waiting ${backoffTime}ms before next attempt`);
        
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        // Try again recursively
        return this.initConnection();
      } else {
        if (!this.mockModeEnabled) {
          toast({
            title: "Database Connection Notice",
            description: "Using demo mode with sample data. Your experience won't be affected.",
            variant: "default",
          });
          
          this.mockModeEnabled = true;
          enableMockMode(true); // Enable mock mode when connection fails
          console.log('Using mock database mode for demonstration purposes');
        }
        
        // For demo purposes, we can pretend to be connected to allow functionality to work
        this.connected = true;
        return false;
      }
    }
  }

  isConnected() {
    return this.connected;
  }

  isMockModeEnabled() {
    return this.mockModeEnabled;
  }

  async ensureConnected() {
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

  async reconnect() {
    if (!this.isConnected()) {
      console.log('Attempting to reconnect to the database...');
      this.connectionAttempts = 0; // Reset attempts counter for reconnection
      return this.initConnection();
    } else {
      console.log('Database connection is already connected.');
      return true;
    }
  }
}

const dbConnection = DatabaseConnection.getInstance();

// Utility function to check database connection
export const checkDatabaseConnection = async () => {
  if (!dbConnection.isConnected()) {
    console.log('Database connection is not active. Attempting to reconnect...');
    return await dbConnection.ensureConnected();
  } else {
    console.log('Database connection is active.');
    
    // If connection is active but we're in mock mode, attempt to reconnect to real database
    if (dbConnection.isMockModeEnabled()) {
      console.log('Currently in mock mode. Attempting to connect to real database...');
      dbConnection.connectionAttempts = 0;
      return await dbConnection.initConnection();
    }
    
    return true;
  }
};

export default dbConnection;
