
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car, Shield, Clock, CreditCard, Map, Users, Star,
  BatteryCharging, MessageSquare, Award, Tag, CalendarClock
} from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';

const Home = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: 'Safe & Secure',
      description: 'Background-checked drivers and real-time ride tracking for your safety'
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: 'Quick Pickups',
      description: 'Get picked up in minutes with our wide network of drivers'
    },
    {
      icon: <CreditCard className="h-6 w-6 text-blue-500" />,
      title: 'Easy Payments',
      description: 'Multiple payment options including cash, card, and digital wallets'
    },
    {
      icon: <Map className="h-6 w-6 text-blue-500" />,
      title: 'Multi-stop Rides',
      description: 'Add multiple stops to your journey with ease'
    },
    {
      icon: <Tag className="h-6 w-6 text-blue-500" />,
      title: 'Fare Negotiation',
      description: 'Negotiate fares with drivers for the best rate'
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: 'Favorite Drivers',
      description: 'Save your preferred drivers for future rides'
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
      title: 'In-app Chat',
      description: 'Communicate with your driver without leaving the app'
    },
    {
      icon: <BatteryCharging className="h-6 w-6 text-blue-500" />,
      title: 'Carbon Tracking',
      description: 'Monitor your carbon footprint with each ride'
    },
    {
      icon: <CalendarClock className="h-6 w-6 text-blue-500" />,
      title: 'Subscription Plans',
      description: 'Save with daily, weekly, or monthly ride passes'
    },
  ];
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Regular Commuter',
      content: 'GoCabs has completely transformed my daily commute. The drivers are professional, the cars are clean, and the app is so easy to use!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Business Traveler',
      content: 'As someone who travels for business frequently, I need reliable transportation. GoCabs delivers consistently, and the fare negotiation feature has saved me a lot of money.',
      rating: 4
    },
    {
      name: 'Jessica Williams',
      role: 'Parent',
      content: 'I feel safe putting my teenage children in GoCabs. The safety features and real-time tracking give me peace of mind when they need rides.',
      rating: 5
    }
  ];
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
                Your Ride, Your Way
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl">
                GoCabs offers a premium ride-hailing experience with more control, more options, and more savings. Book a ride in seconds, negotiate your fare, and enjoy the journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Sign Up Now
                </Link>
                <Link
                  to="/rider/book"
                  className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-all duration-200"
                >
                  Book a Ride
                </Link>
              </div>
            </div>
            <div className="relative lg:ml-10">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transform rotate-1">
                <img
                  src="/assets/taxi-app.jpg"
                  alt="GoCabs App"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x400?text=GoCabs+App';
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-yellow-400 dark:bg-yellow-500 rounded-lg shadow-lg p-4 transform -rotate-3">
                <div className="flex items-center">
                  <Car className="h-8 w-8 text-yellow-800" />
                  <div className="ml-3">
                    <p className="text-sm font-bold text-yellow-800">Book Now</p>
                    <p className="text-xs text-yellow-800">Drivers nearby</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Grid Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Packed with Features
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
              GoCabs is designed to give you the best ride-hailing experience possible
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-50 dark:bg-blue-900/20 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              How GoCabs Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
              Simple, reliable, and efficient ride-hailing in just a few steps
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-300">
                Three simple steps
              </span>
            </div>
          </div>
          
          <div className="mt-12 lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="text-center mb-12 lg:mb-0">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mx-auto">
                <Map className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">Request</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Enter your pickup location and destination, then choose your preferred ride type
              </p>
            </div>
            
            <div className="text-center mb-12 lg:mb-0">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mx-auto">
                <Car className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">Match</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Get matched with a nearby driver and track their arrival in real-time
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mx-auto">
                <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">Ride</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Enjoy your ride, pay through the app or cash, and rate your experience
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
              Don't just take our word for it — hear from our happy riders
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < testimonial.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300 dark:text-gray-600'
                      }`} 
                    />
                  ))}
                </div>
                <blockquote className="text-gray-600 dark:text-gray-300 mb-4">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Ready to Experience GoCabs?
              </h2>
              <p className="mt-4 text-lg text-blue-100 max-w-3xl">
                Join thousands of satisfied riders and drivers on the GoCabs platform. Download our app today and enjoy rides your way.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-lg transition-all duration-200"
                >
                  Sign Up
                </Link>
                <Link
                  to="/register?role=driver"
                  className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-all duration-200"
                >
                  Become a Driver
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 flex justify-center">
              <div className="grid grid-cols-2 gap-4 transform rotate-3">
                <div className="flex justify-end">
                  <img 
                    className="h-48 w-auto rounded-lg shadow-lg transform -rotate-6 translate-y-4"
                    src="/assets/app-screen-1.jpg"
                    alt="GoCabs App Screenshot 1"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x600?text=App+Screen+1';
                    }}
                  />
                </div>
                <div>
                  <img 
                    className="h-56 w-auto rounded-lg shadow-lg transform rotate-6 -translate-y-4"
                    src="/assets/app-screen-2.jpg"
                    alt="GoCabs App Screenshot 2"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x600?text=App+Screen+2';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
