import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, Users, CreditCard, Car } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { checkDatabaseConnection } from "@/utils/database";

const Booking = () => {
  const [stops, setStops] = useState([{ id: 1, address: "" }]);
  const [selectedRideType, setSelectedRideType] = useState("standard");
  const [favoriteDrivers] = useState([
    { id: 1, name: "John Doe", rating: 4.9, car: "Toyota Camry", available: true },
    { id: 2, name: "Jane Smith", rating: 4.8, car: "Honda Civic", available: false },
    { id: 3, name: "Alex Johnson", rating: 4.7, car: "Ford Focus", available: true },
  ]);
  const [passengers, setPassengers] = useState("1");

  const addStop = () => {
    if (stops.length < 5) {
      setStops([...stops, { id: stops.length + 1, address: "" }]);
    }
  };

  const removeStop = (id: number) => {
    if (stops.length > 1) {
      setStops(stops.filter(stop => stop.id !== id));
    }
  };

  const updateStop = (id: number, value: string) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, address: value } : stop
    ));
  };

  const rideTypes = [
    { id: "standard", name: "Standard", price: "$10-15", time: "10-15 min", icon: <Car className="h-4 w-4" /> },
    { id: "premium", name: "Premium", price: "$18-25", time: "5-10 min", icon: <Car className="h-4 w-4" /> },
    { id: "eco", name: "Eco", price: "$8-12", time: "12-18 min", icon: <Car className="h-4 w-4" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gocabs-secondary dark:text-white">Book a Ride</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="border border-gray-200 dark:border-gray-700 shadow-soft">
            <CardHeader>
              <CardTitle className="text-gocabs-secondary dark:text-white">Enter ride details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="standard" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="standard">Standard</TabsTrigger>
                  <TabsTrigger value="multi-stop">Multi-stop</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>
                
                <TabsContent value="standard" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pickup" className="text-gray-700 dark:text-gray-300">Pickup Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input id="pickup" placeholder="Enter pickup location" className="pl-10" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="destination" className="text-gray-700 dark:text-gray-300">Destination</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input id="destination" placeholder="Enter destination" className="pl-10" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="multi-stop" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pickup-multi" className="text-gray-700 dark:text-gray-300">Pickup Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input id="pickup-multi" placeholder="Enter pickup location" className="pl-10" />
                      </div>
                    </div>
                    
                    {stops.map((stop, index) => (
                      <div key={stop.id} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Label htmlFor={`stop-${stop.id}`} className="text-gray-700 dark:text-gray-300">
                            {index === stops.length - 1 ? "Final Destination" : `Stop ${index + 1}`}
                          </Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input 
                              id={`stop-${stop.id}`} 
                              placeholder={index === stops.length - 1 ? "Enter final destination" : `Enter stop ${index + 1}`} 
                              className="pl-10"
                              value={stop.address}
                              onChange={(e) => updateStop(stop.id, e.target.value)}
                            />
                          </div>
                        </div>
                        {stops.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-500 hover:text-red-500 mt-6"
                            onClick={() => removeStop(stop.id)}
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {stops.length < 5 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full mt-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                        onClick={addStop}
                      >
                        Add another stop
                      </Button>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="schedule" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input id="date" type="date" className="pl-10" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">Time</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input id="time" type="time" className="pl-10" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="pickup-schedule" className="text-gray-700 dark:text-gray-300">Pickup Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input id="pickup-schedule" placeholder="Enter pickup location" className="pl-10" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="destination-schedule" className="text-gray-700 dark:text-gray-300">Destination</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input id="destination-schedule" placeholder="Enter destination" className="pl-10" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Number of Passengers</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Select value={passengers} onValueChange={setPassengers}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select passengers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 passenger</SelectItem>
                          <SelectItem value="2">2 passengers</SelectItem>
                          <SelectItem value="3">3 passengers</SelectItem>
                          <SelectItem value="4">4 passengers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Ride Type</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {rideTypes.map((type) => (
                        <div 
                          key={type.id}
                          className={`border rounded-md p-3 cursor-pointer transition-all ${
                            selectedRideType === type.id 
                              ? "border-gocabs-primary bg-gocabs-primary/10" 
                              : "border-gray-200 dark:border-gray-700 hover:border-gocabs-primary/50"
                          }`}
                          onClick={() => setSelectedRideType(type.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gocabs-secondary dark:text-white">{type.name}</span>
                            {type.icon}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <div>{type.price}</div>
                            <div>{type.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-gray-700 dark:text-gray-300">Ride Preferences</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="silent" />
                        <label
                          htmlFor="silent"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                        >
                          <VolumeX className="h-4 w-4 mr-1" /> Silent ride
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="music" />
                        <label
                          htmlFor="music"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                        >
                          <Music className="h-4 w-4 mr-1" /> Play my music
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ac" />
                        <label
                          htmlFor="ac"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                        >
                          <Thermometer className="h-4 w-4 mr-1" /> AC on
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 bg-gocabs-primary hover:bg-gocabs-primary/90">
                    Find Drivers
                  </Button>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border border-gray-200 dark:border-gray-700 shadow-soft mb-6">
            <CardHeader>
              <CardTitle className="text-gocabs-secondary dark:text-white">Favorite Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {favoriteDrivers.map((driver) => (
                  <div 
                    key={driver.id}
                    className={`border rounded-md p-3 ${
                      driver.available 
                        ? "cursor-pointer hover:border-gocabs-primary/50" 
                        : "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gocabs-secondary dark:text-white">{driver.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {driver.rating} · {driver.car}
                        </div>
                      </div>
                      {driver.available ? (
                        <div className="text-sm text-green-500 dark:text-green-400">Available</div>
                      ) : (
                        <div className="text-sm text-gray-500">Unavailable</div>
                      )}
                    </div>
                  </div>
                ))}

                <Button variant="ghost" className="w-full text-gocabs-primary hover:text-gocabs-primary/80 hover:bg-gocabs-primary/10">
                  View All Favorites
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 dark:border-gray-700 shadow-soft">
            <CardHeader>
              <CardTitle className="text-gocabs-secondary dark:text-white">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="border rounded-md p-3 cursor-pointer hover:border-gocabs-primary/50 flex justify-between items-center">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-3 text-gocabs-primary" />
                    <div>
                      <div className="font-medium text-gocabs-secondary dark:text-white">Credit Card</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">**** 4821</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="border rounded-md p-3 cursor-pointer hover:border-gocabs-primary/50 flex justify-between items-center">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-3 text-gocabs-primary" />
                    <div>
                      <div className="font-medium text-gocabs-secondary dark:text-white">Cash</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Pay to driver</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                
                <Button variant="ghost" className="w-full text-gocabs-primary hover:text-gocabs-primary/80 hover:bg-gocabs-primary/10">
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Booking;
