
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Get the current theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-2xl font-bold text-white">
              <span className="text-yellow-500">Go</span>Cabs
            </Link>
            
            <nav className="hidden ml-10 md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-yellow-500' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/booking" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/booking') 
                    ? 'text-yellow-500' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Book a Ride
              </Link>
              <Link 
                to="/history" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/history') 
                    ? 'text-yellow-500' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Ride History
              </Link>
              <Link 
                to="/profile" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/profile') 
                    ? 'text-yellow-500' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Profile
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/notifications" 
              className={`text-sm font-medium transition-colors ${
                isActive('/notifications') 
                  ? 'text-yellow-500' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Bell className="h-5 w-5" />
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  {theme === 'light' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === 'light' ? 'Dark theme' : 'Light theme'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="default" className="hidden md:flex bg-yellow-500 hover:bg-yellow-600 text-black">
              <Link to="/booking">Book Now</Link>
            </Button>
            
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md py-4">
          <div className="container mx-auto px-4 space-y-3">
            <Link 
              to="/" 
              className={`block py-2 text-base font-medium ${
                isActive('/') ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/booking" 
              className={`block py-2 text-base font-medium ${
                isActive('/booking') ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book a Ride
            </Link>
            <Link 
              to="/history" 
              className={`block py-2 text-base font-medium ${
                isActive('/history') ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ride History
            </Link>
            <Link 
              to="/profile" 
              className={`block py-2 text-base font-medium ${
                isActive('/profile') ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link 
              to="/notifications" 
              className={`block py-2 text-base font-medium ${
                isActive('/notifications') ? 'text-yellow-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Notifications
            </Link>
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
              <Link 
                to="/booking" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Now
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
