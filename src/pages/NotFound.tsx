
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <Car className="h-20 w-20 text-blue-500 mb-6" />
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
      <p className="text-gray-600 text-lg max-w-md text-center mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button size="lg" className="flex items-center gap-2">
          <Car size={18} />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
