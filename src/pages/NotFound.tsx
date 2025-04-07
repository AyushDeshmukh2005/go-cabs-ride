
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-gocabs-secondary">
      <Car className="h-24 w-24 text-gocabs-primary mb-8 animate-bounce" />
      <h1 className="text-6xl md:text-8xl font-bold text-gocabs-secondary dark:text-white mb-6 font-sans">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gocabs-secondary dark:text-white mb-6 font-sans">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-8 font-sans">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button asChild size="lg" className="bg-gocabs-primary hover:bg-gocabs-primary/90 text-white shadow-lg transition-all duration-200">
        <Link to="/" className="flex items-center">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
