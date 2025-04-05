
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Car } from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';

const NotFound = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-full p-4 shadow-lg">
            <MapPin className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Destination Not Found
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md text-center mb-8">
          Looks like you've taken a wrong turn. The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          
          <Link
            to="/rider/book"
            className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Car className="h-5 w-5 mr-2" />
            Book a Ride
          </Link>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Need help? <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
