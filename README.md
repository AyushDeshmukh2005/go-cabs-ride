
# GoCabs - Modern Ride-Hailing Platform

GoCabs is a premium ride-hailing platform that offers advanced features for both riders and drivers. This project includes a complete frontend and backend implementation.

## Features

- 🚗 Multi-stop rides
- 💰 Fare negotiation
- ⭐ Favorite drivers
- 🚨 Emergency features
- 🌿 Carbon footprint tracking
- 🎵 Ride preferences
- 👥 Ride pooling
- 🔒 Advanced security
- 📱 Mobile-friendly design
- 🌓 Light/Dark mode

## Prerequisites

- Node.js (v14.x or higher)
- MySQL (v8.x or higher)
- npm or yarn

## Project Structure

```
/
├── backend/               # Backend Node.js/Express server
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── database/          # Database scripts and models
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   └── socket/            # Socket.io real-time features
├── src/                   # Frontend React application
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── context/           # React context providers
└── database/              # Database schema and migrations
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/gocabs.git
cd gocabs
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../
npm install
```

### 3. Set up environment variables

```bash
# Backend environment variables
cd backend
cp .env.example .env
# Edit .env with your database credentials and other settings
```

### 4. Set up database

Create a MySQL database named `gocabs` (or your preferred name, but update .env accordingly).

```bash
# Initialize the database with the schema
cd backend
npm run setup-db
```

### 5. Start the development servers

```bash
# Start backend server (from backend directory)
cd backend
npm run dev

# In a new terminal, start frontend development server (from project root)
npm run dev
```

## API Documentation

The API endpoints are documented using Swagger and can be accessed at `http://localhost:5000/api-docs` when the backend server is running.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
