
import { useState, useEffect } from "react";
import { 
  Car, 
  Clock, 
  Calendar, 
  CreditCard, 
  Leaf, 
  Music, 
  Snowflake, 
  Users, 
  VolumeX,
  Share2, 
  PlusCircle,
  Trash2,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { apiService, RideData } from "@/services/api";
import NearbyDrivers from "@/components/booking/NearbyDrivers";
import BookingConfirmation from "@/components/booking/BookingConfirmation";

const rideTypes = [
  {
    id: "regular",
    name: "Regular",
    description: "Affordable everyday rides",
    price: "Base fare",
    icon: <Car className="h-5 w-5" />,
  },
  {
    id: "premium",
    name: "Premium",
    description: "High-end cars for special occasions",
    price: "+50% fare",
    icon: <Car className="h-5 w-5" />,
  },
  {
    id: "carpool",
    name: "Carpool",
    description: "Share your ride, save money",
    price: "-30% fare",
    icon: <Share2 className="h-5 w-5" />,
  },
];

export default function Booking() {
  // Ride form state
  const [rideType, setRideType] = useState("regular");
  const [passengers, setPassengers] = useState(1);
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [stops, setStops] = useState<string[]>([]);
  const [newStop, setNewStop] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("12:00");
  
  // Ride preferences
  const [preferences, setPreferences] = useState({
    silent: false,
    music: false,
    ac: true,
  });
  
  // Booking flow state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showDrivers, setShowDrivers] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  
  const handleAddStop = () => {
    if (newStop.trim() && stops.length < 3) {
      setStops([...stops, newStop.trim()]);
      setNewStop("");
    } else if (stops.length >= 3) {
      toast({
        title: "Maximum stops reached",
        description: "You can add up to 3 stops for a single ride.",
        variant: "default",
      });
    }
  };
  
  const handleRemoveStop = (index: number) => {
    const newStops = [...stops];
    newStops.splice(index, 1);
    setStops(newStops);
  };
  
  const handleScheduleToggle = (checked: boolean) => {
    setIsScheduled(checked);
    if (!checked) {
      // Reset to current date/time when unscheduling
      setDate(new Date());
      setTime("12:00");
    }
  };
  
  const handleTogglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const validateStep1 = () => {
    if (!pickupAddress) {
      toast({
        title: "Pickup address required",
        description: "Please enter a pickup address.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!destinationAddress) {
      toast({
        title: "Destination required",
        description: "Please enter a destination address.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (isScheduled && (!date || !time)) {
      toast({
        title: "Schedule details required",
        description: "Please select a date and time for your scheduled ride.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    
    // Move to next step
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleBookRide();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleBookRide = async () => {
    try {
      setIsLoading(true);
      
      // Create ride data object
      const rideData: RideData = {
        ride_type: rideType,
        passengers: passengers,
        preferences: {
          silent: preferences.silent,
          music: preferences.music,
          ac: preferences.ac,
        },
        pickup_address: pickupAddress,
        destination_address: destinationAddress,
        stops: stops.length > 0 ? stops : undefined,
        is_scheduled: isScheduled,
        scheduled_at: isScheduled ? `${format(date as Date, 'yyyy-MM-dd')} ${time}` : undefined,
      };
      
      // Call API to book the ride
      const result = await apiService.rides.book(rideData);
      
      // Store booking data for confirmation screen
      setBookingData({
        pickupAddress,
        destinationAddress,
        scheduledTime: isScheduled ? `${format(date as Date, 'MMM dd')} at ${time}` : undefined,
        ...result
      });
      
      if (!isScheduled) {
        // Show drivers nearby for immediate rides
        setShowDrivers(true);
      } else {
        // Show booking confirmation for scheduled rides
        setBookingConfirmed(true);
      }
      
      toast({
        title: isScheduled ? "Ride Scheduled" : "Ride Booked",
        description: isScheduled 
          ? "Your ride has been scheduled successfully." 
          : "Your ride has been booked. Finding drivers...",
      });
    } catch (error) {
      console.error("Error booking ride:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDriverSelected = () => {
    // After driver selection, show booking confirmation
    setShowDrivers(false);
    setBookingConfirmed(true);
  };
  
  const handleResetBooking = () => {
    // Reset booking flow
    setCurrentStep(1);
    setShowDrivers(false);
    setBookingConfirmed(false);
    setBookingData(null);
    
    // Optionally reset form data if needed
    // setPickupAddress("");
    // setDestinationAddress("");
    // setStops([]);
    // setIsScheduled(false);
  };
  
  if (showDrivers) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <NearbyDrivers 
          onDriverSelect={handleDriverSelected}
          onClose={() => setShowDrivers(false)}
        />
      </div>
    );
  }
  
  if (bookingConfirmed && bookingData) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <BookingConfirmation 
          isScheduled={isScheduled}
          scheduledTime={bookingData.scheduledTime}
          pickupAddress={bookingData.pickupAddress}
          destinationAddress={bookingData.destinationAddress}
          estimatedPrice={bookingData.estimatedFare || "$15-20"}
          estimatedTime={bookingData.estimatedArrival || "15-20 min"}
          onDone={handleResetBooking}
        />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Book a Ride</h1>
        <p className="text-gray-500 dark:text-gray-400">Customize your ride experience</p>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
            currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500 dark:bg-gray-700"
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}></div>
          <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
            currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500 dark:bg-gray-700"
          }`}>
            2
          </div>
          <div className={`flex-1 h-1 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}></div>
          <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
            currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500 dark:bg-gray-700"
          }`}>
            3
          </div>
        </div>
      </div>
      
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Where are you going?</CardTitle>
            <CardDescription>Enter your pickup and destination locations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pickup">Pickup Location</Label>
              <Input 
                id="pickup" 
                placeholder="Enter pickup address" 
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input 
                id="destination" 
                placeholder="Enter destination address" 
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Stops (Optional)</Label>
                <span className="text-xs text-gray-500">{stops.length}/3</span>
              </div>
              
              {stops.map((stop, index) => (
                <div key={index} className="flex mb-2">
                  <Input 
                    value={stop} 
                    readOnly 
                    className="flex-1 mr-2" 
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveStop(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              
              {stops.length < 3 && (
                <div className="flex">
                  <Input 
                    placeholder="Add a stop" 
                    className="flex-1 mr-2" 
                    value={newStop}
                    onChange={(e) => setNewStop(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddStop()}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleAddStop}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleNext}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Ride Options</CardTitle>
            <CardDescription>Choose ride type and scheduling options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-3 block">Ride Type</Label>
              <RadioGroup 
                value={rideType}
                onValueChange={setRideType}
                className="space-y-3"
              >
                {rideTypes.map((type) => (
                  <div key={type.id} className="flex">
                    <RadioGroupItem 
                      value={type.id} 
                      id={type.id}
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor={type.id}
                      className="flex flex-1 cursor-pointer items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          {type.icon}
                        </div>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{type.price}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="passengers" className="mb-2 block">Number of Passengers</Label>
              <Select
                value={passengers.toString()}
                onValueChange={(value) => setPassengers(parseInt(value, 10))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select passengers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 passenger</SelectItem>
                  <SelectItem value="2">2 passengers</SelectItem>
                  <SelectItem value="3">3 passengers</SelectItem>
                  <SelectItem value="4">4 passengers</SelectItem>
                  <SelectItem value="5">5 passengers</SelectItem>
                  <SelectItem value="6">6 passengers (XL only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="schedule">Schedule for Later</Label>
                <Switch 
                  id="schedule" 
                  checked={isScheduled}
                  onCheckedChange={handleScheduleToggle}
                />
              </div>
              
              {isScheduled && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label className="mb-2 block">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label htmlFor="time" className="mb-2 block">Time</Label>
                    <Select 
                      value={time}
                      onValueChange={setTime}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="00:00">12:00 AM</SelectItem>
                        <SelectItem value="01:00">1:00 AM</SelectItem>
                        <SelectItem value="02:00">2:00 AM</SelectItem>
                        <SelectItem value="03:00">3:00 AM</SelectItem>
                        <SelectItem value="04:00">4:00 AM</SelectItem>
                        <SelectItem value="05:00">5:00 AM</SelectItem>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                        <SelectItem value="19:00">7:00 PM</SelectItem>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                        <SelectItem value="21:00">9:00 PM</SelectItem>
                        <SelectItem value="22:00">10:00 PM</SelectItem>
                        <SelectItem value="23:00">11:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Ride Preferences</CardTitle>
            <CardDescription>Customize your ride experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mr-3">
                    <VolumeX className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium">Silent Ride</div>
                    <div className="text-sm text-gray-500">Prefer minimal conversation</div>
                  </div>
                </div>
                <Switch 
                  checked={preferences.silent}
                  onCheckedChange={() => handleTogglePreference('silent')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mr-3">
                    <Music className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium">Play Music</div>
                    <div className="text-sm text-gray-500">Driver plays your choice of music</div>
                  </div>
                </div>
                <Switch 
                  checked={preferences.music}
                  onCheckedChange={() => handleTogglePreference('music')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mr-3">
                    <Snowflake className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium">Air Conditioning</div>
                    <div className="text-sm text-gray-500">Keep the AC turned on</div>
                  </div>
                </div>
                <Switch 
                  checked={preferences.ac}
                  onCheckedChange={() => handleTogglePreference('ac')}
                />
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Leaf className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium">Carbon Footprint Reduction</h3>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Your ride will emit approximately 2.3 kg of CO₂. Choose carpool to reduce your carbon footprint.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: rideType === 'carpool' ? '70%' : '30%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Lower impact</span>
                <span>Higher impact</span>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Ride Summary</h3>
              
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ride Type:</span>
                  <span className="font-medium">
                    {rideTypes.find(t => t.id === rideType)?.name || rideType}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Passengers:</span>
                  <span className="font-medium">{passengers}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">When:</span>
                  <span className="font-medium">
                    {isScheduled 
                      ? `${format(date as Date, 'MMM dd')} at ${time}` 
                      : 'Now'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Price:</span>
                  <span className="font-medium">$15-20</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button 
                onClick={handleBookRide} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Booking..." : isScheduled ? "Schedule Ride" : "Book Now"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
