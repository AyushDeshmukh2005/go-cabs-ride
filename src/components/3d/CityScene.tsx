
import { useEffect, useRef, useState } from 'react';

// Main component that replaces the 3D scene with a static image
const CityScene = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    // Mark as mounted for cleanup
    isMounted.current = true;

    // Mark as loaded after a brief delay to ensure smooth rendering
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setIsLoaded(true);
      }
    }, 800);

    // Cleanup function
    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, []);

  const handleError = () => {
    console.error("Error loading image");
    setIsError(true);
  };

  return (
    <div className="w-full h-[500px] relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-600">
          <div className="animate-pulse text-white text-xl">Loading Image...</div>
        </div>
      )}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-600">
          <div className="text-white text-xl">
            <p>Unable to load image.</p>
            <p className="text-sm">Please check your connection.</p>
          </div>
        </div>
      )}
      <div 
        className={`w-full h-full ${isLoaded && !isError ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 flex items-center justify-center`}
      >
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <img 
            src="/lovable-uploads/b120027a-e38c-41c0-b0a9-020392fe1410.png" 
            alt="GoCabs Taxi on City Street"
            className="w-full h-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-700"
            onLoad={() => setIsLoaded(true)}
            onError={handleError}
          />
          {/* Subtle animation overlay to give some movement */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default CityScene;
