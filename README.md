
# GoCabs - Modern Ride-Hailing Platform

GoCabs is a modern ride-hailing platform with premium features for both riders and drivers. This project includes a complete frontend and backend implementation with all the essential features of a ride-hailing service.

## Features

- User authentication (riders, drivers, admins)
- Ride booking and scheduling
- Multi-stop rides
- Fare negotiation
- Favorite drivers and routes
- Ride mood settings (silent ride, music preference)
- Carbon footprint tracking
- Weather & traffic-aware pricing
- Subscription passes
- Real-time tracking with Socket.io
- Driver-rider chat
- Emergency features
- Admin panel for management
- Responsive design with light/dark mode

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Real-time**: Socket.io
- **Maps**: Google Maps API integration
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MySQL (v8 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/gocabs.git
   cd gocabs
   ```

2. Set up the database:
   ```
   mysql -u root -p < database/schema.sql
   ```

3. Configure the environment variables:
   ```
   cp backend/.env.example backend/.env
   ```
   Edit the `.env` file with your database credentials and other configuration options.

4. Install dependencies and start the development server:
   ```
   # Install backend dependencies
   cd backend
   npm install
   
   # Start backend server
   npm run dev
   
   # In a new terminal, install frontend dependencies
   cd ../
   npm install
   
   # Start frontend development server
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
gocabs/
├── backend/           # Node.js/Express backend
├── public/            # Static assets
├── src/               # React/TypeScript frontend
├── database/          # Database schema and seed data
└── README.md          # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by modern ride-hailing applications
- Icons provided by Lucide React
- UI components from Shadcn UI
