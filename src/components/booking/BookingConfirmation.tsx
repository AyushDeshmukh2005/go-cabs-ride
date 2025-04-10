
import { useState } from "react";
import { Calendar, CheckCircle, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BookingConfirmationProps {
  isScheduled?: boolean;
  scheduledTime?: string;
  pickupAddress: string;
  destinationAddress: string;
  estimatedPrice?: string;
  estimatedTime?: string;
  onDone: () => void;
}

export const BookingConfirmation = ({
  isScheduled = false,
  scheduledTime,
  pickupAddress,
  destinationAddress,
  estimatedPrice = "$15-20",
  estimatedTime = "15-20 min",
  onDone
}: BookingConfirmationProps) => {
  const navigate = useNavigate();
  
  const handleViewRide = () => {
    if (isScheduled) {
      navigate("/history");
    } else {
      onDone();
    }
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="bg-green-100 rounded-full p-4 mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {isScheduled ? "Ride Scheduled Successfully" : "Booking Confirmed"}
          </h3>
          
          <p className="text-gray-500 text-center mb-6">
            {isScheduled 
              ? `Your ride has been scheduled for ${scheduledTime}.` 
              : "Your ride has been booked and a driver is on the way."}
          </p>
          
          <div className="w-full border rounded-lg p-4 mb-6">
            <div className="flex items-start mb-4">
              <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-0.5">
                <span className="text-xs font-bold">A</span>
              </div>
              <div>
                <div className="text-sm text-gray-500">Pickup</div>
                <div className="font-medium">{pickupAddress}</div>
              </div>
            </div>
            
            <div className="border-l-2 border-dashed border-gray-300 h-6 ml-3"></div>
            
            <div className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3 mt-0.5">
                <span className="text-xs font-bold">B</span>
              </div>
              <div>
                <div className="text-sm text-gray-500">Destination</div>
                <div className="font-medium">{destinationAddress}</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-gray-500">Est. Time</span>
              </div>
              <div className="font-semibold">{estimatedTime}</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <span className="text-sm text-gray-500">Est. Price</span>
              </div>
              <div className="font-semibold">{estimatedPrice}</div>
            </div>
          </div>
          
          {isScheduled && (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-lg w-full mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium">Scheduled for {scheduledTime}</div>
                <div className="text-sm">You'll get a reminder 30 minutes before pickup</div>
              </div>
            </div>
          )}
          
          <div className="flex space-x-4 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onDone}
            >
              {isScheduled ? "Schedule Another" : "New Ride"}
            </Button>
            
            <Button 
              className="flex-1"
              onClick={handleViewRide}
            >
              {isScheduled ? "View Scheduled" : "Done"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingConfirmation;
