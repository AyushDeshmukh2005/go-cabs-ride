
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white">
      <Car className="h-24 w-24 text-yellow-500 mb-8 animate-bounce" />
      <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 font-inter">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 font-inter">Page Not Found</h2>
      <p className="text-gray-300 text-center max-w-md mb-8 font-inter">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
        <Link to="/" className="flex items-center">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
