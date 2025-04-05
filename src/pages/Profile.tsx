
import { useState } from "react";
import { 
  User, 
  CreditCard, 
  Shield, 
  Bell, 
  ThumbsUp, 
  Home, 
  Briefcase, 
  MapPin, 
  Settings, 
  Edit, 
  ChevronRight, 
  LogOut,
  Award,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    joined: "April 2023",
    paymentMethods: [
      { id: 1, type: "Credit Card", last4: "4821", expiry: "05/26", default: true },
      { id: 2, type: "Credit Card", last4: "7632", expiry: "09/24", default: false },
    ],
    addresses: [
      { id: 1, type: "Home", address: "123 Main Street, Apt 4B, New York, NY 10001", default: true },
      { id: 2, type: "Work", address: "456 Business Ave, Suite 200, New York, NY 10018", default: false },
    ],
    favorites: [
      { id: 1, name: "John Doe", rating: 4.9, trips: 5 },
      { id: 2, name: "Sarah Williams", rating: 4.8, trips: 3 },
    ],
    emergencyContacts: [
      { id: 1, name: "Emma Johnson", phone: "+1 (555) 987-6543", relationship: "Spouse" },
    ],
    achievements: [
      { id: 1, title: "Early Adopter", description: "Joined during first month", icon: <Award className="h-6 w-6" />, unlocked: true },
      { id: 2, title: "Frequent Rider", description: "Completed 10+ rides", icon: <Award className="h-6 w-6" />, unlocked: true },
      { id: 3, title: "Perfect Rating", description: "Maintained 5-star rating", icon: <Award className="h-6 w-6" />, unlocked: false },
    ]
  });

  const [notifications] = useState({
    rideUpdates: true,
    marketing: false,
    driverArrival: true,
    promotions: true,
    newsAndTips: false,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gocabs-secondary dark:text-white">Your Profile</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <Card className="border border-gray-200 dark:border-gray-700 shadow-soft mb-6">
            <CardContent className="p-6 text-center">
              <div className="mb-4 inline-flex items-center justify-center">
                <div className="relative">
                  <div className="bg-gocabs-primary/20 rounded-full w-24 h-24 flex items-center justify-center text-gocabs-primary text-4xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 bg-white dark:bg-gocabs-accent h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-1 text-gocabs-secondary dark:text-white">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Member since {user.joined}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 dark:bg-gocabs-accent/50 py-2 px-3 rounded-md">
                  <div className="text-lg font-bold text-gocabs-secondary dark:text-white">25</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Rides</div>
                </div>
                <div className="bg-gray-50 dark:bg-gocabs-accent/50 py-2 px-3 rounded-md">
                  <div className="text-lg font-bold text-gocabs-secondary dark:text-white">4.9</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
                </div>
              </div>
              
              <Button className="w-full bg-gocabs-primary hover:bg-gocabs-primary/90">Edit Profile</Button>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 dark:border-gray-700 shadow-soft">
            <CardHeader>
              <CardTitle className="text-gocabs-secondary dark:text-white">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-3 border rounded-md flex items-center ${
                      achievement.unlocked 
                        ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20" 
                        : "border-gray-200 dark:border-gray-700 opacity-60"
                    }`}
                  >
                    <div className={`p-2 rounded-full mr-3 ${
                      achievement.unlocked 
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gocabs-secondary dark:text-white">{achievement.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</div>
                    </div>
                    {achievement.unlocked && (
                      <Check className="h-5 w-5 ml-auto text-green-500 dark:text-green-400" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="border border-gray-200 dark:border-gray-700 shadow-soft">
            <CardHeader>
              <CardTitle className="text-gocabs-secondary dark:text-white">Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gocabs-secondary dark:text-white">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                        <Input id="phone" defaultValue={user.phone} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gocabs-secondary dark:text-white">Emergency Contacts</h3>
                    <div className="space-y-3">
                      {user.emergencyContacts.map((contact) => (
                        <div key={contact.id} className="p-3 border rounded-md flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gocabs-secondary dark:text-white">{contact.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{contact.phone} • {contact.relationship}</div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full">
                        Add Emergency Contact
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gocabs-secondary dark:text-white">Account Security</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="new-password" className="text-gray-700 dark:text-gray-300">New Password</Label>
                        <Input id="new-password" type="password" placeholder="Enter new password" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
                        <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-gocabs-primary hover:bg-gocabs-primary/90">Save Changes</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="payment" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gocabs-secondary dark:text-white">Payment Methods</h3>
                    <div className="space-y-3">
                      {user.paymentMethods.map((method) => (
                        <div key={method.id} className="p-3 border rounded-md flex justify-between items-center">
                          <div className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-3 text-gocabs-primary" />
                            <div>
                              <div className="font-medium text-gocabs-secondary dark:text-white">
                                {method.type} •••• {method.last4}
                                {method.default && <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">Default</span>}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Expires {method.expiry}</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full">
                        Add Payment Method
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gocabs-secondary dark:text-white">Billing Information</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="billing-name" className="text-gray-700 dark:text-gray-300">Name on Card</Label>
                        <Input id="billing-name" defaultValue={user.name} />
                      </div>
                      <div>
                        <Label htmlFor="billing-address" className="text-gray-700 dark:text-gray-300">Billing Address</Label>
                        <Input id="billing-address" defaultValue={user.addresses[0].address} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-gocabs-primary hover:bg-gocabs-primary/90">Save Changes</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="addresses" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gocabs-secondary dark:text-white">Saved Addresses</h3>
                    <div className="space-y-3">
                      {user.addresses.map((address) => (
                        <div key={address.id} className="p-3 border rounded-md flex justify-between items-center">
                          <div className="flex items-center">
                            {address.type === "Home" ? (
                              <Home className="h-5 w-5 mr-3 text-gocabs-primary" />
                            ) : (
                              <Briefcase className="h-5 w-5 mr-3 text-gocabs-primary" />
                            )}
                            <div>
                              <div className="font-medium text-gocabs-secondary dark:text-white">
                                {address.type}
                                {address.default && <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">Default</span>}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{address.address}</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full">
                        Add Address
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gocabs-secondary dark:text-white">Frequently Visited</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-3 text-gocabs-primary" />
                          <div>
                            <div className="font-medium text-gocabs-secondary dark:text-white">Central Park</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">New York, NY 10022</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-3 text-gocabs-primary" />
                          <div>
                            <div className="font-medium text-gocabs-secondary dark:text-white">Grand Central Terminal</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">89 E 42nd St, New York, NY 10017</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-gocabs-primary hover:bg-gocabs-primary/90">Save Changes</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="favorites" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gocabs-secondary dark:text-white">Favorite Drivers</h3>
                    <div className="space-y-3">
                      {user.favorites.map((driver) => (
                        <div key={driver.id} className="p-3 border rounded-md flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="bg-gocabs-primary/20 rounded-full w-10 h-10 flex items-center justify-center text-gocabs-primary font-bold mr-3">
                              {driver.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gocabs-secondary dark:text-white">{driver.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {driver.rating} ★ • {driver.trips} trips together
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="text-gocabs-primary border-gocabs-primary hover:bg-gocabs-primary/10">
                              Request
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gocabs-secondary dark:text-white">Favorite Routes</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-medium text-gocabs-secondary dark:text-white">Home to Work</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">~15 min</div>
                        </div>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-sm">
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-2">A</div>
                            <div className="text-gray-700 dark:text-gray-300">123 Main Street, Apt 4B</div>
                          </div>
                          <div className="border-l-2 border-dashed border-gray-300 dark:border-gray-600 h-5 ml-3"></div>
                          <div className="flex items-center text-sm">
                            <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mr-2">B</div>
                            <div className="text-gray-700 dark:text-gray-300">456 Business Ave, Suite 200</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full text-gocabs-primary border-gocabs-primary hover:bg-gocabs-primary/10">
                          Book This Route
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gocabs-secondary dark:text-white">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gocabs-secondary dark:text-white">Ride Updates</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about your rides</div>
                        </div>
                        <Switch checked={notifications.rideUpdates} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gocabs-secondary dark:text-white">Driver Arrival</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Get alerts when your driver is arriving</div>
                        </div>
                        <Switch checked={notifications.driverArrival} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gocabs-secondary dark:text-white">Promotions</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Receive discounts and special offers</div>
                        </div>
                        <Switch checked={notifications.promotions} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gocabs-secondary dark:text-white">Marketing Emails</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Receive emails about our services</div>
                        </div>
                        <Switch checked={notifications.marketing} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gocabs-secondary dark:text-white">News and Tips</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Get the latest news and ride-sharing tips</div>
                        </div>
                        <Switch checked={notifications.newsAndTips} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gocabs-secondary dark:text-white">Ride Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gocabs-secondary dark:text-white">Silent Rides</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Prefer minimal conversation during rides</div>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gocabs-secondary dark:text-white">AC Always On</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Prefer AC to be turned on during rides</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-gocabs-primary hover:bg-gocabs-primary/90">Save Changes</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="mt-6 flex justify-end">
            <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-500/10">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
