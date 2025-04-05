
import { ArrowRight, CheckCircle, Clock, CreditCard, MapPin, Shield, Smartphone, ThumbsUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  const features = [
    {
      icon: <MapPin className="h-6 w-6 text-blue-500" />,
      title: "Multi-stop rides",
      description: "Plan your journey with multiple destinations in a single ride"
    },
    {
      icon: <CreditCard className="h-6 w-6 text-blue-500" />,
      title: "Fare negotiation",
      description: "Negotiate the price directly with your driver for the best deal"
    },
    {
      icon: <ThumbsUp className="h-6 w-6 text-blue-500" />,
      title: "Favorite drivers",
      description: "Save your preferred drivers for future bookings"
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: "Emergency features",
      description: "Quick access to emergency contacts and driver swap"
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: "Subscription passes",
      description: "Save money with daily, weekly or monthly ride passes"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Ride pooling",
      description: "Share your ride with others going the same direction"
    }
  ];

  const howItWorks = [
    {
      number: "01",
      title: "Request a ride",
      description: "Enter your destination and select the type of ride you want"
    },
    {
      number: "02",
      title: "Get matched with a driver",
      description: "We'll connect you with the best driver nearby"
    },
    {
      number: "03",
      title: "Track your ride",
      description: "Follow your driver's arrival and journey in real-time"
    },
    {
      number: "04",
      title: "Arrive safely",
      description: "Rate your driver and save them as a favorite for next time"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fadeIn">
                Your journey, your way with GoCabs
              </h1>
              <p className="text-xl mb-8 text-blue-100 max-w-lg animate-fadeIn" style={{ animationDelay: "0.2s" }}>
                Experience the most comfortable and customizable ride-hailing service. Book, ride, and enjoy!
              </p>
              <div className="flex flex-wrap gap-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-blue-600">
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="/taxi-illustration.svg" 
                alt="GoCabs ride-hailing" 
                className="w-full max-w-lg animate-fadeIn"
                style={{ animationDelay: "0.6s" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Premium Features for Premium Rides</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Enjoy a range of advanced features designed to make your rides more comfortable and convenient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How GoCabs Works</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Getting a ride is easier than ever with our simple four-step process
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to experience better rides?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of happy riders who have chosen GoCabs for their daily commute and special journeys.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            <Link to="/register" className="flex items-center">
              Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GoCabs</h3>
              <p className="text-gray-400">
                The modern ride-hailing platform with premium features for both riders and drivers.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-white">Services</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Ride Booking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Multi-stop Rides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Subscriptions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">For Drivers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@gocabs.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>123 Main Street, City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} GoCabs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
