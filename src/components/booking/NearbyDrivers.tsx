
import { useEffect, useState } from "react";
import { Car, CheckCircle, Clock, MapPin, Star, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface Driver {
  id: number;
  name: string;
  vehicle: string;
  rating: number;
  distanceAway: string;
  location?: {
    lat: number;
    lng: number;
  };
}

interface NearbyDriversProps {
  onDriverSelect?: (driver: Driver) => void;
  onClose?: () => void;
  isScheduled?: boolean;
}

export const NearbyDrivers = ({ onDriverSelect, onClose, isScheduled = false }: NearbyDriversProps) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  useEffect(() => {
    const fetchNearbyDrivers = async () => {
      try {
        setLoading(true);
        const data = await apiService.rides.getNearbyDrivers();
        setDrivers(data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch nearby drivers:", err);
        setError("Could not fetch nearby drivers. Please try again.");
        toast({
          title: "Error",
          description: "Could not find nearby drivers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyDrivers();

    // If not scheduled, simulate a polling effect
    if (!isScheduled) {
      const interval = setInterval(fetchNearbyDrivers, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isScheduled]);

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    if (onDriverSelect) {
      onDriverSelect(driver);
    }
    
    toast({
      title: "Driver Selected",
      description: `${driver.name} will be your driver.`,
    });
  };

  if (loading && drivers.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin mb-4">
              <Car size={36} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Finding drivers...</h3>
            <p className="text-gray-500 text-center">
              We're looking for available drivers near your location.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && drivers.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-10">
            <X size={36} className="text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No drivers found</h3>
            <p className="text-gray-500 text-center mb-4">
              {error}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="secondary"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedDriver) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle size={48} className="text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Driver Confirmed</h3>
            
            <div className="flex items-center mt-4 mb-4">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <Car className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <div className="font-semibold text-lg">{selectedDriver.name}</div>
                <div className="text-gray-500">{selectedDriver.vehicle}</div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span>{selectedDriver.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center text-gray-500 mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>Arrives in {selectedDriver.distanceAway}</span>
            </div>
            
            {isScheduled ? (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md w-full text-center">
                Your ride is scheduled. The driver will pick you up at the scheduled time.
              </div>
            ) : (
              <div className="flex space-x-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Contact Driver
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {isScheduled ? "Available Drivers" : "Nearby Drivers"}
          </h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {drivers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <MapPin size={36} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No drivers found</h3>
            <p className="text-gray-500 text-center">
              There are no drivers available in your area right now. Please try again later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {drivers.map((driver) => (
              <div 
                key={driver.id} 
                className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => handleSelectDriver(driver)}
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <Car className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-semibold">{driver.name}</div>
                    <div className="text-sm text-gray-500">{driver.vehicle}</div>
                    <div className="flex items-center text-sm">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>{driver.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">{driver.distanceAway}</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NearbyDrivers;
