
import React from 'react';
import { Button } from "@/components/ui/button";
import { Car, MapPin, Calendar, CreditCard, WifiIcon, AirVent, Headphones, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Index = () => {
  const handleBookNow = () => {
    toast({
      title: "Booking initiated",
      description: "Finding the closest driver for you...",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header/Navigation */}
      <header className="w-full bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Car className="text-blue-600 mr-2" size={28} />
            <h1 className="text-2xl font-bold text-blue-600">GoCabs</h1>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/rides" className="text-gray-700 hover:text-blue-600 font-medium">My Rides</Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">Profile</Link>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">Log In</Button>
            <Button>Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12 md:py-24 flex flex-col-reverse md:flex-row items-center">
        <div className="md:w-1/2 md:pr-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Your ride, your way
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Book rides with your preferred settings, favorite drivers, and multi-stop options. GoCabs gives you complete control of your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={handleBookNow} className="flex items-center">
              <Car className="mr-2" /> Book a Ride Now
            </Button>
            <Button size="lg" variant="outline">
              View Subscription Plans
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 mb-10 md:mb-0">
          <img 
            src="https://placehold.co/600x400/e6efff/1a56db?text=GoCabs+App" 
            alt="GoCabs app interface" 
            className="rounded-lg shadow-xl" 
          />
        </div>
      </section>

      {/* Features Highlight */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Advanced Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Star className="text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Favorite Drivers</h4>
              <p className="text-gray-600">Save your preferred drivers for future rides and quicker bookings.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MapPin className="text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Multi-stop Rides</h4>
              <p className="text-gray-600">Add multiple stops to your journey without booking separate rides.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Headphones className="text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Ride Mood Settings</h4>
              <p className="text-gray-600">Set your preferences for music, conversation, and AC before your ride.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Subscription Passes</h4>
              <p className="text-gray-600">Save with daily, weekly, or monthly subscription plans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Dialog Demo */}
      <section className="container mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Try Our Smart Booking Experience</h3>
        
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                <div className="flex items-center p-2 border rounded-lg">
                  <MapPin className="text-gray-400 mr-2" size={20} />
                  <input 
                    type="text" 
                    placeholder="Current Location"
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <div className="flex items-center p-2 border rounded-lg">
                  <MapPin className="text-gray-400 mr-2" size={20} />
                  <input 
                    type="text" 
                    placeholder="Where to?"
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Clock className="mr-2" size={18} />
                    Ride Preferences & Mood
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Set Your Ride Preferences</DialogTitle>
                    <DialogDescription>
                      Customize your ride experience with these options.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Conversation Preference</h4>
                      <RadioGroup defaultValue="normal">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="silent" id="silent" />
                          <label htmlFor="silent">Silent Ride</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="normal" />
                          <label htmlFor="normal">Normal Conversation</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="chatty" id="chatty" />
                          <label htmlFor="chatty">Chatty Driver</label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Music Preference</h4>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select music genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Music</SelectItem>
                          <SelectItem value="pop">Pop</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                          <SelectItem value="jazz">Jazz</SelectItem>
                          <SelectItem value="classical">Classical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">AC Setting</h4>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select AC setting" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="off">Off</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Save Preferences</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Button className="w-full" size="lg">
              Find a Driver
            </Button>
          </div>
          
          <div className="bg-blue-50 p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Estimated fare</p>
              <p className="text-xl font-bold">$12.50 - $15.20</p>
            </div>
            <div className="flex items-center">
              <WifiIcon className="text-blue-500 mr-1" size={16} />
              <span className="text-sm text-blue-500">Weather & traffic adjusted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6">Save with GoCabs Subscriptions</h3>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            Unlock exclusive benefits and save on regular rides with our flexible subscription plans.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <h4 className="text-2xl font-bold mb-2">Daily Pass</h4>
              <p className="text-5xl font-bold mb-6">$9.99</p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-2 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>Unlimited rides for 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-2 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>Priority matching</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-2 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>Basic cancellation protection</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-blue-800">
                Get Daily Pass
              </Button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h4 className="text-2xl font-bold mb-2">Weekly Pass</h4>
              <p className="text-5xl font-bold mb-6">$49.99</p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-2 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>Unlimited rides for 7 days</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-2 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>Priority matching & premium drivers</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-2 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>Full cancellation protection</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-2 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>Favorite driver selection</span>
                </li>
              </ul>
              <Button className="w-full bg-white text-blue-800 hover:bg-blue-50">
                Get Weekly Pass
              </Button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <h4 className="text-2xl font-bold mb-2">Monthly Pass</h4>
              <p className="text-5xl font-bold mb-6">$159.99</p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-2 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>Unlimited rides for 30 days</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-2 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>VIP driver access</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-2 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>Premium vehicle selection</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 rounded-full p-1 mr-2 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>Carbon offset for all trips</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-blue-800">
                Get Monthly Pass
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Carbon Footprint Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img 
              src="https://placehold.co/600x400/e6f7ef/0d8a4e?text=Carbon+Tracker" 
              alt="Carbon footprint tracker" 
              className="rounded-lg shadow-lg" 
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Track Your Carbon Footprint</h3>
            <p className="text-lg text-gray-600 mb-6">
              GoCabs helps you make environmentally conscious choices. Our carbon footprint tracker provides real-time metrics on the environmental impact of each ride.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="bg-green-100 text-green-600 p-1 rounded-full mr-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>View detailed emissions data per ride</span>
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-600 p-1 rounded-full mr-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>Compare your impact with average metrics</span>
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-600 p-1 rounded-full mr-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>Contribute to environmental initiatives</span>
              </li>
            </ul>
            <Button variant="outline" className="flex items-center text-green-600 border-green-600 hover:bg-green-50">
              Learn More About Our Green Initiatives
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Car className="text-blue-400 mr-2" size={24} />
                <h4 className="text-xl font-bold">GoCabs</h4>
              </div>
              <p className="text-gray-400">The smarter way to get around town with customizable rides.</p>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Driver App</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Support</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Download App</h5>
              <div className="flex space-x-3">
                <a href="#" className="bg-gray-700 hover:bg-gray-600 p-2 rounded">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.0432 10.6152L6.35555 0.174803C6.09372 -0.0657383 5.66506 -0.0583526 5.41212 0.183266C5.15918 0.424885 5.15241 0.827069 5.39784 1.07672L15.722 11.9932L5.39607 22.8231C5.15065 23.0731 5.15741 23.4752 5.41036 23.7169C5.53684 23.8379 5.6984 23.8984 5.86054 23.8984C6.01498 23.8984 6.16941 23.8457 6.29296 23.7413L17.0451 13.3707C17.1657 13.2462 17.2363 13.0781 17.2363 10.9932C17.2344 10.9066 17.1623 10.7385 17.0432 10.6152Z" fill="white"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-700 hover:bg-gray-600 p-2 rounded">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.0632 0H7.93677C7.33551 0 6.85156 0.483948 6.85156 1.0852V22.9148C6.85156 23.5161 7.33551 24 7.93677 24H16.0632C16.6645 24 17.1484 23.5161 17.1484 22.9148V1.0852C17.1484 0.483948 16.6645 0 16.0632 0ZM12 23.0371C11.4427 23.0371 10.9909 22.5854 10.9909 22.028C10.9909 21.4707 11.4427 21.019 12 21.019C12.5573 21.019 13.0091 21.4707 13.0091 22.028C13.0091 22.5854 12.5573 23.0371 12 23.0371ZM15.7559 20.0052H8.24414V2.27848H15.7559V20.0052Z" fill="white"/>
                  </svg>
                </a>
              </div>
              <p className="text-gray-400 mt-4">Available on iOS and Android. Download now!</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 GoCabs. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.675 0H1.325C0.593 0 0 0.593 0 1.325V22.676C0 23.407 0.593 24 1.325 24H12.82V14.706H9.692V11.084H12.82V8.413C12.82 5.313 14.713 3.625 17.479 3.625C18.804 3.625 19.942 3.724 20.274 3.768V7.008L18.356 7.009C16.852 7.009 16.561 7.724 16.561 8.772V11.085H20.148L19.681 14.707H16.561V24H22.677C23.407 24 24 23.407 24 22.675V1.325C24 0.593 23.407 0 22.675 0Z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.954 4.569C23.069 4.958 22.124 5.223 21.129 5.344C22.143 4.733 22.923 3.77 23.292 2.621C22.341 3.176 21.287 3.58 20.165 3.805C19.269 2.846 17.992 2.246 16.574 2.246C13.857 2.246 11.654 4.449 11.654 7.163C11.654 7.553 11.699 7.928 11.781 8.287C7.691 8.094 4.066 6.13 1.64 3.161C1.213 3.883 0.974 4.722 0.974 5.636C0.974 7.346 1.844 8.849 3.162 9.732C2.355 9.706 1.596 9.484 0.934 9.116V9.177C0.934 11.562 2.627 13.551 4.88 14.004C4.467 14.115 4.031 14.175 3.584 14.175C3.27 14.175 2.969 14.145 2.668 14.089C3.299 16.042 5.113 17.466 7.272 17.506C5.592 18.825 3.463 19.611 1.17 19.611C0.78 19.611 0.391 19.588 0 19.544C2.189 20.938 4.768 21.75 7.557 21.75C16.611 21.75 21.556 14.25 21.556 7.749C21.556 7.534 21.55 7.32 21.538 7.108C22.502 6.411 23.341 5.544 24.001 4.548L23.954 4.569Z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163C15.204 2.163 15.584 2.175 16.85 2.233C20.102 2.381 21.621 3.924 21.769 7.152C21.827 8.417 21.838 8.797 21.838 12.001C21.838 15.206 21.826 15.585 21.769 16.85C21.62 20.075 20.105 21.621 16.85 21.769C15.584 21.827 15.206 21.839 12 21.839C8.796 21.839 8.416 21.827 7.151 21.769C3.891 21.62 2.38 20.07 2.232 16.849C2.174 15.584 2.162 15.205 2.162 12C2.162 8.796 2.175 8.417 2.232 7.151C2.381 3.924 3.896 2.38 7.151 2.232C8.417 2.175 8.796 2.163 12 2.163ZM12 0C8.741 0 8.333 0.014 7.053 0.072C2.695 0.272 0.273 2.69 0.073 7.052C0.014 8.333 0 8.741 0 12C0 15.259 0.014 15.668 0.072 16.948C0.272 21.306 2.69 23.728 7.052 23.928C8.333 23.986 8.741 24 12 24C15.259 24 15.668 23.986 16.948 23.928C21.302 23.728 23.73 21.31 23.927 16.948C23.986 15.668 24 15.259 24 12C24 8.741 23.986 8.333 23.928 7.053C23.732 2.699 21.311 0.273 16.949 0.073C15.668 0.014 15.259 0 12 0V0ZM12 5.838C8.597 5.838 5.838 8.597 5.838 12C5.838 15.403 8.597 18.163 12 18.163C15.403 18.163 18.162 15.404 18.162 12C18.162 8.597 15.403 5.838 12 5.838ZM12 16C9.791 16 8 14.21 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.21 14.209 16 12 16ZM18.406 4.155C17.61 4.155 16.965 4.8 16.965 5.595C16.965 6.39 17.61 7.035 18.406 7.035C19.201 7.035 19.845 6.39 19.845 5.595C19.845 4.8 19.201 4.155 18.406 4.155Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
