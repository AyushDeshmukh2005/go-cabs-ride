
import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, MapPin, Clock, Car } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Mock notification data
const notifications = [
  {
    id: 1,
    type: 'ride_confirmation',
    title: 'Ride Confirmed',
    message: 'Your ride has been confirmed for tomorrow at 9:00 AM',
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    time: '2 hours ago',
    isRead: false,
    action: 'View Details',
    badge: 'New'
  },
  {
    id: 2,
    type: 'driver_arriving',
    title: 'Driver is Arriving',
    message: 'Your driver John is 5 minutes away',
    icon: <Car className="h-5 w-5 text-blue-500" />,
    time: '5 hours ago',
    isRead: false,
    action: 'Track Ride',
    badge: 'New'
  },
  {
    id: 3,
    type: 'promotion',
    title: 'Weekend Discount',
    message: 'Get 15% off on your rides this weekend with code WEEKEND15',
    icon: <Info className="h-5 w-5 text-purple-500" />,
    time: '1 day ago',
    isRead: true,
    action: 'Apply Code'
  },
  {
    id: 4,
    type: 'account',
    title: 'Subscription Renewed',
    message: 'Your monthly subscription has been renewed successfully',
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    time: '2 days ago',
    isRead: true
  },
  {
    id: 5,
    type: 'location',
    title: 'New Service Area',
    message: 'GoCabs is now available in Downtown West area',
    icon: <MapPin className="h-5 w-5 text-red-500" />,
    time: '3 days ago',
    isRead: true
  },
  {
    id: 6,
    type: 'warning',
    title: 'Payment Method Expiring',
    message: 'Your saved credit card will expire in 7 days',
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    time: '3 days ago',
    isRead: true,
    action: 'Update Card'
  },
  {
    id: 7,
    type: 'schedule',
    title: 'Ride Reminder',
    message: 'Your scheduled ride to the airport is tomorrow at 6:00 AM',
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    time: '4 days ago',
    isRead: true
  }
];

export default function Notifications() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">Stay updated with your ride status and account activity</p>
        </div>
        <Button variant="outline">
          Mark All as Read
        </Button>
      </div>
      
      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`transition-all hover:shadow-md ${!notification.isRead ? 'border-l-4 border-l-yellow-500' : ''}`}
          >
            <CardHeader className="flex flex-row items-start space-y-0 pb-2">
              <div className="flex items-center flex-1">
                <div className="mr-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                  {notification.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{notification.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {notification.time}
                  </CardDescription>
                </div>
              </div>
              {notification.badge && (
                <Badge variant="outline" className="bg-yellow-500 text-black">
                  {notification.badge}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <p>{notification.message}</p>
            </CardContent>
            {notification.action && (
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  {notification.action}
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
