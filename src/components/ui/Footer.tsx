
import { Link } from "react-router-dom";
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white rounded-full p-1">
                <Car className="h-6 w-6 text-black" />
              </div>
              <span className="font-bold text-xl">GOCABS</span>
            </div>
            <p className="text-gray-300 mb-4">
              The modern ride-hailing platform with premium features for both riders and drivers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-300 hover:text-white transition-colors">Book a Ride</Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-300 hover:text-white transition-colors">Ride History</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Regular Rides</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Multi-stop Rides</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Subscription Plans</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Corporate Services</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-300">support@gocabs.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-1 text-gray-400" />
                <span className="text-gray-300">123 Ride Street, Tech City, TC 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
          <p>© {currentYear} GOCABS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
