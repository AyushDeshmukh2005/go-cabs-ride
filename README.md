
# GoCabs Ride-Sharing Application

A comprehensive ride-sharing platform with both rider and driver interfaces, real-time location tracking, payment processing, and admin management features.

## Features

- User authentication (riders, drivers, admins)
- Real-time ride tracking
- Subscription management
- Emergency contact system
- Optimized routing
- Payment processing
- Admin dashboard

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd gocabs
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file with your local configuration, particularly:
- Database credentials
- JWT secret key
- Google Maps API key (if using location features)

### 3. Database Setup

Make sure MySQL is running, then run:

```bash
npm run setup-db
```

This will create the database and initialize all required tables.

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Backend Server

```bash
cd backend
npm run dev
```

The server will start on port 5000 (or as specified in your .env file).

### 6. Start the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at http://localhost:8080

## Project Structure

- `backend/` - Server-side code
  - `config/` - Configuration files and database setup
  - `controllers/` - API endpoint controllers
  - `middleware/` - Express middleware
  - `routes/` - API route definitions
  - `socket/` - Socket.IO for real-time communication
  - `database/` - Database setup and utilities
  
- `src/` - Frontend code
  - `components/` - Reusable React components
  - `pages/` - Page components
  - `hooks/` - Custom React hooks
  - `utils/` - Utility functions
  - `services/` - API services

## Troubleshooting

### Database Connection Issues

- Ensure MySQL is running on the configured host and port
- Verify database credentials in the .env file
- Check firewall settings if connecting to a remote database

### Server Won't Start

- Check for port conflicts
- Ensure all required environment variables are set
- Look for errors in the console output

## Development Notes

- The backend uses ES modules rather than CommonJS
- Socket.IO is used for real-time updates
- Environment variables prefixed with `VITE_` are available in the frontend

## License

[License information]
