
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Leaf, TrendingDown, AlertTriangle } from 'lucide-react';

const CarbonFootprintTracker = ({ rideId }) => {
  const [carbonData, setCarbonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCarbonFootprint = async () => {
      if (!rideId) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/optimization/carbon/${rideId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setCarbonData(response.data);
      } catch (error) {
        console.error('Error fetching carbon footprint:', error);
        setError('Failed to load carbon footprint data');
        toast.error('Could not load carbon footprint information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarbonFootprint();
  }, [rideId]);
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-yellow-500">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-300">{error}</span>
        </div>
      </div>
    );
  }
  
  if (!carbonData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 py-4">
          <Leaf className="h-5 w-5 mr-2" />
          <span>No carbon data available for this ride</span>
        </div>
      </div>
    );
  }
  
  // Calculate impact metrics
  const treesNeeded = (carbonData.carbon_footprint / 21).toFixed(2); // Average tree absorbs 21kg CO2 per year
  const impactLevel = 
    carbonData.carbon_footprint < 1 ? 'Low impact' :
    carbonData.carbon_footprint < 3 ? 'Moderate impact' : 
    'High impact';
  
  const impactColor = 
    carbonData.carbon_footprint < 1 ? 'text-green-600 dark:text-green-400' :
    carbonData.carbon_footprint < 3 ? 'text-yellow-600 dark:text-yellow-400' : 
    'text-red-600 dark:text-red-400';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
        <Leaf className="h-5 w-5 text-green-500 mr-2" />
        Carbon Footprint
      </h3>
      
      <div className="space-y-4">
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-gray-800 dark:text-white">
            {carbonData.carbon_footprint.toFixed(2)} kg
          </div>
          <div className={`text-sm font-medium ${impactColor}`}>
            {impactLevel}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-start mb-2">
            <TrendingDown className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                You saved {carbonData.carbon_saved.toFixed(2)} kg of CO2
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Thanks to our optimized routing
              </p>
            </div>
          </div>
          
          <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
            <div className="flex justify-between">
              <span>Distance traveled:</span>
              <span className="font-medium">{carbonData.distance_km.toFixed(2)} km</span>
            </div>
            <div className="flex justify-between">
              <span>CO2 per km:</span>
              <span className="font-medium">{carbonData.footprint_per_km.toFixed(2)} kg/km</span>
            </div>
            <div className="flex justify-between">
              <span>Trees needed to offset:</span>
              <span className="font-medium">{treesNeeded} trees</span>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Want to offset your carbon footprint? Check out our{' '}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            carbon offset programs
          </a>
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprintTracker;
