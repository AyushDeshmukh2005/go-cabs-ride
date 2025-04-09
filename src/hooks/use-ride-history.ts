
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { apiService, handleApiError } from "@/services/api";

interface RideHistoryData {
  id: number;
  date: string;
  time: string;
  pickup: string;
  destination: string;
  driver: string;
  rating: number;
  price: string;
  status: string;
  carbon: string;
  paymentMethod: string;
}

interface ScheduledRideData {
  id: number;
  date: string;
  time: string;
  pickup: string;
  destination: string;
  price: string;
  status: string;
}

export function useRideHistory() {
  const [rideHistory, setRideHistory] = useState<RideHistoryData[]>([]);
  const [scheduledRides, setScheduledRides] = useState<ScheduledRideData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        setIsLoading(true);
        
        // In a production app, uncomment these API calls
        // For now using mock data to ensure the app doesn't break if backend isn't available
        /*
        const historyData = await apiService.rides.getHistory();
        const scheduledData = await apiService.rides.getScheduled();
        
        setRideHistory(historyData);
        setScheduledRides(scheduledData);
        */
        
        // Mock data for development
        const mockHistoryData = [
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

        const mockScheduledData = [
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

        setRideHistory(mockHistoryData);
        setScheduledRides(mockScheduledData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch ride history:", err);
        const errorMessage = handleApiError(err, "Failed to load ride history");
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRideHistory();
  }, []);

  // Function to book a ride again based on a previous ride
  const bookAgain = async (rideId: number) => {
    try {
      // In a real app, uncomment this
      // await apiService.rides.bookAgain(rideId);
      
      toast({
        title: "Success",
        description: "Ride booked successfully!",
      });
      
      // Navigation would happen here
    } catch (err) {
      handleApiError(err, "Failed to book ride");
    }
  };

  // Function to cancel a scheduled ride
  const cancelRide = async (rideId: number) => {
    try {
      // In a real app, uncomment this
      // await apiService.rides.cancel(rideId);
      
      // Update local state to reflect cancellation
      setScheduledRides(scheduledRides.filter(ride => ride.id !== rideId));
      
      toast({
        title: "Success",
        description: "Ride cancelled successfully!",
      });
    } catch (err) {
      handleApiError(err, "Failed to cancel ride");
    }
  };

  return {
    rideHistory,
    scheduledRides,
    isLoading,
    error,
    bookAgain,
    cancelRide,
  };
}
