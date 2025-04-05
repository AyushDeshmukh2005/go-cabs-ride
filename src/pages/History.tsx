
import { useState } from "react";
import { 
  Clock, 
  MapPin, 
  Star, 
  CreditCard, 
  Leaf, 
  Calendar, 
  Search, 
  Filter,
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for ride history
const rideHistory = [
  {
    id: 1,
    date: "2025-04-02",
    time: "08:30 AM",
    pickup: "123 Main St",
    destination: "456 Market St",
    driver: "John Doe",
    rating: 5,
    price: "$15.50",
    status: "completed",
    carbon: "1.2 kg CO₂",
    paymentMethod: "Credit Card",
  },
  {
    id: 2,
    date: "2025-04-01",
    time: "05:45 PM",
    pickup: "456 Market St",
    destination: "123 Main St",
    driver: "Jane Smith",
    rating: 4,
    price: "$12.75",
    status: "completed",
    carbon: "0.9 kg CO₂",
    paymentMethod: "Cash",
  },
  {
    id: 3,
    date: "2025-03-30",
    time: "10:15 AM",
    pickup: "789 Park Ave",
    destination: "101 Tech Blvd",
    driver: "Alex Johnson",
    rating: 5,
    price: "$22.30",
    status: "completed",
    carbon: "1.8 kg CO₂",
    paymentMethod: "Credit Card",
  },
  {
    id: 4,
    date: "2025-03-28",
    time: "02:00 PM",
    pickup: "101 Tech Blvd",
    destination: "Central Mall",
    driver: "Sarah Williams",
    rating: 4,
    price: "$10.25",
    status: "completed",
    carbon: "0.7 kg CO₂",
    paymentMethod: "Credit Card",
  },
  {
    id: 5,
    date: "2025-03-25",
    time: "09:30 AM",
    pickup: "123 Main St",
    destination: "Airport Terminal 2",
    driver: "Michael Brown",
    rating: 5,
    price: "$42.80",
    status: "completed",
    carbon: "3.2 kg CO₂",
    paymentMethod: "Cash",
  },
];

// Upcoming scheduled rides
const scheduledRides = [
  {
    id: 101,
    date: "2025-04-08",
    time: "08:00 AM",
    pickup: "123 Main St",
    destination: "Airport Terminal 1",
    price: "$40-45",
    status: "scheduled",
  },
  {
    id: 102,
    date: "2025-04-15",
    time: "07:30 AM",
    pickup: "123 Main St",
    destination: "Conference Center",
    price: "$15-18",
    status: "scheduled",
  },
];

const History = () => {
  const [expandedRide, setExpandedRide] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMonth, setFilterMonth] = useState<string>("");

  const toggleRideDetails = (id: number) => {
    setExpandedRide(expandedRide === id ? null : id);
  };

  // Filter rides based on search query and month filter
  const filteredRides = rideHistory.filter(ride => {
    const matchesQuery = searchQuery.trim() === "" || 
      ride.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.driver.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMonth = filterMonth === "" || 
      (filterMonth && new Date(ride.date).getMonth() === parseInt(filterMonth) - 1);
    
    return matchesQuery && matchesMonth;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gocabs-secondary dark:text-white">Your Ride History</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="border border-gray-200 dark:border-gray-700 shadow-soft mb-6">
            <CardHeader>
              <CardTitle className="text-gocabs-secondary dark:text-white">Ride History</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="history">Past Rides</TabsTrigger>
                  <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                </TabsList>
                
                <TabsContent value="history" className="space-y-4">
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input 
                        placeholder="Search rides..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="w-full md:w-40">
                      <Select value={filterMonth} onValueChange={setFilterMonth}>
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All months</SelectItem>
                          <SelectItem value="1">January</SelectItem>
                          <SelectItem value="2">February</SelectItem>
                          <SelectItem value="3">March</SelectItem>
                          <SelectItem value="4">April</SelectItem>
                          <SelectItem value="5">May</SelectItem>
                          <SelectItem value="6">June</SelectItem>
                          <SelectItem value="7">July</SelectItem>
                          <SelectItem value="8">August</SelectItem>
                          <SelectItem value="9">September</SelectItem>
                          <SelectItem value="10">October</SelectItem>
                          <SelectItem value="11">November</SelectItem>
                          <SelectItem value="12">December</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {filteredRides.length > 0 ? (
                    <div className="space-y-3">
                      {filteredRides.map((ride) => (
                        <div 
                          key={ride.id} 
                          className="border rounded-md overflow-hidden bg-white dark:bg-gocabs-accent shadow-sm transition-all"
                        >
                          <div 
                            className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gocabs-accent/80 flex justify-between items-center"
                            onClick={() => toggleRideDetails(ride.id)}
                          >
                            <div className="flex items-start space-x-4">
                              <div className="bg-gocabs-primary/10 p-2 rounded-full">
                                <Clock className="h-5 w-5 text-gocabs-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-gocabs-secondary dark:text-white">{ride.date} · {ride.time}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" /> {ride.pickup} to {ride.destination}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="text-right mr-3">
                                <div className="font-medium text-gocabs-secondary dark:text-white">{ride.price}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{ride.paymentMethod}</div>
                              </div>
                              {expandedRide === ride.id ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                          
                          {expandedRide === ride.id && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gocabs-accent/70 animate-fadeIn">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Driver</h4>
                                  <div className="flex items-center">
                                    <div className="bg-gocabs-primary/20 rounded-full w-10 h-10 flex items-center justify-center text-gocabs-primary font-bold mr-3">
                                      {ride.driver.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-medium text-gocabs-secondary dark:text-white">{ride.driver}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                          <Star 
                                            key={i} 
                                            className={`h-3 w-3 ${i < ride.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Ride Details</h4>
                                  <div className="text-sm space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500 dark:text-gray-400">Payment</span>
                                      <span className="font-medium text-gocabs-secondary dark:text-white flex items-center">
                                        <CreditCard className="h-3 w-3 mr-1" /> {ride.paymentMethod}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500 dark:text-gray-400">Carbon Footprint</span>
                                      <span className="font-medium text-green-600 dark:text-green-400 flex items-center">
                                        <Leaf className="h-3 w-3 mr-1" /> {ride.carbon}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex space-x-3 mt-4">
                                <Button variant="outline" size="sm" className="text-gocabs-primary border-gocabs-primary hover:bg-gocabs-primary/10">
                                  Book Again
                                </Button>
                                <Button variant="ghost" size="sm">View Receipt</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No rides found matching your filters.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="scheduled" className="space-y-4">
                  {scheduledRides.length > 0 ? (
                    <div className="space-y-3">
                      {scheduledRides.map((ride) => (
                        <div 
                          key={ride.id} 
                          className="border rounded-md p-4 bg-white dark:bg-gocabs-accent shadow-sm hover:border-gocabs-primary/50 transition-all"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-start space-x-4">
                              <div className="bg-gocabs-primary/10 p-2 rounded-full">
                                <Calendar className="h-5 w-5 text-gocabs-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-gocabs-secondary dark:text-white">{ride.date} · {ride.time}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" /> {ride.pickup} to {ride.destination}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gocabs-secondary dark:text-white">{ride.price}</div>
                              <div className="text-sm text-blue-500 dark:text-blue-400">Scheduled</div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-3 mt-4">
                            <Button variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-500/10">
                              Cancel
                            </Button>
                            <Button variant="outline" size="sm" className="text-gocabs-primary border-gocabs-primary hover:bg-gocabs-primary/10">
                              Reschedule
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No scheduled rides found.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4 text-gocabs-primary border-gocabs-primary hover:bg-gocabs-primary/10"
                      >
                        Schedule a Ride
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border border-gray-200 dark:border-gray-700 shadow-soft mb-6">
            <CardHeader>
              <CardTitle className="text-gocabs-secondary dark:text-white">Carbon Footprint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mb-2">
                  <Leaf className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gocabs-secondary dark:text-white">7.8 kg CO₂</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total carbon this month</p>
              </div>
              
              <div className="space-y-3 mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">CO₂ saved by carpooling</span>
                  <span className="font-medium text-green-600 dark:text-green-400">3.2 kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Average per ride</span>
                  <span className="font-medium text-gocabs-secondary dark:text-white">1.5 kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Vs. private car usage</span>
                  <span className="font-medium text-green-600 dark:text-green-400">-42%</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full text-gocabs-primary border-gocabs-primary hover:bg-gocabs-primary/10">
                  View Detailed Report
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 dark:border-gray-700 shadow-soft">
            <CardHeader>
              <CardTitle className="text-gocabs-secondary dark:text-white">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gocabs-accent/50 rounded-md">
                  <h4 className="text-2xl font-bold text-gocabs-secondary dark:text-white">{rideHistory.length}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Rides</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gocabs-accent/50 rounded-md">
                  <h4 className="text-2xl font-bold text-gocabs-secondary dark:text-white">
                    ${rideHistory.reduce((total, ride) => total + parseFloat(ride.price.replace('$', '')), 0).toFixed(2)}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gocabs-accent/50 rounded-md">
                  <h4 className="text-2xl font-bold text-gocabs-secondary dark:text-white">4.6</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Rating</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gocabs-accent/50 rounded-md">
                  <h4 className="text-2xl font-bold text-gocabs-secondary dark:text-white">3</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Favorite Drivers</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full text-gocabs-primary border-gocabs-primary hover:bg-gocabs-primary/10">
                  Download History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default History;
