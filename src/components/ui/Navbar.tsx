
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Car, Menu, X, User, Bell, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  // Setup theme based on user preference
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Book a Ride", path: "/booking" },
    { name: "Ride History", path: "/history" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-black dark:bg-white rounded-full p-1">
              <Car className="h-6 w-6 text-white dark:text-black" />
            </div>
            <span className="font-bold text-xl text-black dark:text-white">
              FINORA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`theme-transition text-sm font-medium hover:text-black dark:hover:text-white ${
                  location.pathname === link.path
                    ? "text-black dark:text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 theme-transition"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="text-black dark:text-white">
                <Bell size={18} />
              </Button>
              
              <Link to="/profile">
                <Button variant="outline" size="sm" className="rounded-full border-2 border-black text-black dark:border-white dark:text-white hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-white transition-all duration-200">
                  <User size={16} className="mr-1" />
                  <span>Account</span>
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-black dark:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black shadow-lg animate-fadeInScale">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`py-2 px-4 rounded-md theme-transition ${
                    location.pathname === link.path
                      ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/profile"
                className="py-2 px-4 rounded-md flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 theme-transition"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={18} className="mr-2" />
                <span>Account</span>
              </Link>
              <Link
                to="/notifications"
                className="py-2 px-4 rounded-md flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 theme-transition"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bell size={18} className="mr-2" />
                <span>Notifications</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
