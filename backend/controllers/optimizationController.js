
const db = require('../config/db');

// Mock API call to optimization service
const mockOptimizeRouteCall = async (origin, destination, waypoints) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock response
  const originalDistance = Math.random() * 10 + 5; // 5-15 km
  const optimizedDistance = originalDistance * (Math.random() * (0.95 - 0.75) + 0.75); // 75-95% of original
  const timeSaved = Math.floor(Math.random() * 10) + 5; // 5-15 minutes
  const fuelSaved = (originalDistance - optimizedDistance) * 0.08; // 0.08L per km saved
  
  return {
    original_route: {
      distance: originalDistance.toFixed(2),
      duration: Math.floor(originalDistance * 3),
      path: generateMockPath(origin, destination, false)
    },
    optimized_route: {
      distance: optimizedDistance.toFixed(2),
      duration: Math.floor(optimizedDistance * 3),
      path: generateMockPath(origin, destination, true)
    },
    optimization_stats: {
      distance_saved: (originalDistance - optimizedDistance).toFixed(2),
      time_saved: timeSaved,
      fuel_saved: fuelSaved.toFixed(2),
      co2_reduced: (fuelSaved * 2.3).toFixed(2) // 2.3kg CO2 per liter
    },
    traffic_conditions: {
      congestion_level: Math.random().toFixed(2),
      incidents: Math.floor(Math.random() * 3),
      road_closures: Math.random() > 0.8 ? 1 : 0
    }
  };
};

// Generate mock path coordinates
const generateMockPath = (origin, destination, optimized) => {
  const originCoords = origin.split(',').map(Number);
  const destCoords = destination.split(',').map(Number);
  
  const points = [];
  const pointCount = optimized ? 6 : 4;
  
  for (let i = 0; i <= pointCount; i++) {
    const ratio = i / pointCount;
    
    // Add some randomness to the path
    const jitter = optimized ? 0.001 : 0.003;
    const lat = originCoords[0] + (destCoords[0] - originCoords[0]) * ratio + (Math.random() - 0.5) * jitter;
    const lng = originCoords[1] + (destCoords[1] - originCoords[1]) * ratio + (Math.random() - 0.5) * jitter;
    
    points.push([lat, lng]);
  }
  
  return points;
};

// Optimize route
exports.optimizeRoute = async (req, res) => {
  const { ride_id } = req.params;
  const { waypoints } = req.body;
  
  try {
    // Get ride details
    const [rides] = await db.query(
      'SELECT * FROM rides WHERE id = ?',
      [ride_id]
    );
    
    if (rides.length === 0) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    const ride = rides[0];
    
    // Get existing stops
    const [stops] = await db.query(
      'SELECT * FROM ride_stops WHERE ride_id = ? ORDER BY stop_order',
      [ride_id]
    );
    
    // Build waypoints array
    const stopWaypoints = stops.map(stop => stop.stop_coordinates);
    const allWaypoints = [...(waypoints || []), ...stopWaypoints];
    
    // Call optimization service (mock)
    const optimizationResult = await mockOptimizeRouteCall(
      ride.pickup_coordinates,
      ride.dropoff_coordinates,
      allWaypoints
    );
    
    // Save optimization results
    const [existingOptimization] = await db.query(
      'SELECT * FROM ride_optimization WHERE ride_id = ?',
      [ride_id]
    );
    
    if (existingOptimization.length > 0) {
      // Update existing optimization
      await db.query(
        `UPDATE ride_optimization SET 
        original_route = ?, 
        optimized_route = ?, 
        traffic_conditions = ?, 
        optimization_factor = ?, 
        fuel_saved = ?, 
        time_saved = ? 
        WHERE ride_id = ?`,
        [
          JSON.stringify(optimizationResult.original_route),
          JSON.stringify(optimizationResult.optimized_route),
          JSON.stringify(optimizationResult.traffic_conditions),
          parseFloat(optimizationResult.original_route.distance) / parseFloat(optimizationResult.optimized_route.distance),
          parseFloat(optimizationResult.optimization_stats.fuel_saved),
          optimizationResult.optimization_stats.time_saved,
          ride_id
        ]
      );
    } else {
      // Create new optimization record
      await db.query(
        `INSERT INTO ride_optimization (
          ride_id, 
          original_route, 
          optimized_route, 
          traffic_conditions, 
          optimization_factor, 
          fuel_saved, 
          time_saved
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          ride_id,
          JSON.stringify(optimizationResult.original_route),
          JSON.stringify(optimizationResult.optimized_route),
          JSON.stringify(optimizationResult.traffic_conditions),
          parseFloat(optimizationResult.original_route.distance) / parseFloat(optimizationResult.optimized_route.distance),
          parseFloat(optimizationResult.optimization_stats.fuel_saved),
          optimizationResult.optimization_stats.time_saved
        ]
      );
    }
    
    // Calculate carbon footprint
    const carbonFootprint = parseFloat(optimizationResult.optimization_stats.co2_reduced);
    
    // Update ride with carbon footprint
    await db.query(
      'UPDATE rides SET carbon_footprint = ? WHERE id = ?',
      [carbonFootprint, ride_id]
    );
    
    res.status(200).json({
      message: 'Route optimized successfully',
      optimization: optimizationResult,
      carbon_footprint: carbonFootprint
    });
  } catch (error) {
    console.error('Error optimizing route:', error);
    res.status(500).json({ message: 'Failed to optimize route' });
  }
};

// Get optimized route
exports.getOptimizedRoute = async (req, res) => {
  const { ride_id } = req.params;
  
  try {
    // Get optimization data
    const [optimization] = await db.query(
      'SELECT * FROM ride_optimization WHERE ride_id = ?',
      [ride_id]
    );
    
    if (optimization.length === 0) {
      return res.status(404).json({ message: 'Optimization not found for this ride' });
    }
    
    // Parse JSON fields
    const result = {
      ...optimization[0],
      original_route: JSON.parse(optimization[0].original_route),
      optimized_route: JSON.parse(optimization[0].optimized_route),
      traffic_conditions: JSON.parse(optimization[0].traffic_conditions)
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting optimized route:', error);
    res.status(500).json({ message: 'Failed to get optimized route' });
  }
};

// Get carbon footprint
exports.getCarbonFootprint = async (req, res) => {
  const { ride_id } = req.params;
  
  try {
    const [rides] = await db.query(
      'SELECT carbon_footprint, distance_km FROM rides WHERE id = ?',
      [ride_id]
    );
    
    if (rides.length === 0) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    const ride = rides[0];
    
    // If no carbon footprint is set, calculate a default one
    if (!ride.carbon_footprint) {
      // Average car emits about 0.2 kg CO2 per km
      const carbonFootprint = ride.distance_km * 0.2;
      
      await db.query(
        'UPDATE rides SET carbon_footprint = ? WHERE id = ?',
        [carbonFootprint, ride_id]
      );
      
      ride.carbon_footprint = carbonFootprint;
    }
    
    // Get optimization if available
    const [optimization] = await db.query(
      'SELECT fuel_saved FROM ride_optimization WHERE ride_id = ?',
      [ride_id]
    );
    
    // Calculate saved carbon
    const savedCarbon = optimization.length > 0 
      ? optimization[0].fuel_saved * 2.3 // 2.3kg CO2 per liter
      : 0;
    
    res.status(200).json({
      ride_id,
      carbon_footprint: parseFloat(ride.carbon_footprint),
      carbon_saved: savedCarbon,
      net_footprint: parseFloat(ride.carbon_footprint) - savedCarbon,
      distance_km: parseFloat(ride.distance_km),
      footprint_per_km: parseFloat(ride.carbon_footprint) / parseFloat(ride.distance_km)
    });
  } catch (error) {
    console.error('Error getting carbon footprint:', error);
    res.status(500).json({ message: 'Failed to get carbon footprint' });
  }
};

// Get traffic data
exports.getTrafficData = async (req, res) => {
  const { city, time } = req.query;
  
  try {
    // In a real application, this would call an external traffic API
    // For now, we'll generate mock data
    
    let trafficFactor;
    
    if (time) {
      const hour = new Date(time).getHours();
      if (hour >= 7 && hour <= 10) {
        // Morning rush hour
        trafficFactor = Math.random() * (1.5 - 1.2) + 1.2;
      } else if (hour >= 16 && hour <= 19) {
        // Evening rush hour
        trafficFactor = Math.random() * (1.6 - 1.3) + 1.3;
      } else if (hour >= 22 || hour <= 5) {
        // Late night / early morning
        trafficFactor = Math.random() * (1.1 - 0.9) + 0.9;
      } else {
        // Regular hours
        trafficFactor = Math.random() * (1.2 - 1.0) + 1.0;
      }
    } else {
      trafficFactor = Math.random() * (1.3 - 1.0) + 1.0;
    }
    
    const trafficData = {
      city: city || 'Default City',
      traffic_factor: trafficFactor.toFixed(2),
      congestion_level: (Math.random() * (1.0 - 0.1) + 0.1).toFixed(2),
      incident_count: Math.floor(Math.random() * 5),
      road_closures: Math.random() > 0.8 ? 1 : 0,
      timestamp: new Date()
    };
    
    res.status(200).json(trafficData);
  } catch (error) {
    console.error('Error getting traffic data:', error);
    res.status(500).json({ message: 'Failed to get traffic data' });
  }
};

// Get weather data
exports.getWeatherData = async (req, res) => {
  const { city } = req.query;
  
  if (!city) {
    return res.status(400).json({ message: 'City parameter is required' });
  }
  
  try {
    // Check if we have recent weather data for this city
    const [existingData] = await db.query(
      'SELECT * FROM weather_data WHERE city = ? AND recorded_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)',
      [city]
    );
    
    if (existingData.length > 0) {
      return res.status(200).json(existingData[0]);
    }
    
    // In a real application, this would call an external weather API
    // For now, we'll generate mock data
    
    const weatherConditions = ['clear', 'rain', 'snow', 'fog', 'storm'];
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    let temperature, precipitation, windSpeed, surgeMultiplier;
    
    switch (randomCondition) {
      case 'clear':
        temperature = Math.random() * (30 - 15) + 15;
        precipitation = 0;
        windSpeed = Math.random() * 10;
        surgeMultiplier = 1.0;
        break;
      case 'rain':
        temperature = Math.random() * (20 - 10) + 10;
        precipitation = Math.random() * (20 - 5) + 5;
        windSpeed = Math.random() * (20 - 10) + 10;
        surgeMultiplier = 1.2;
        break;
      case 'snow':
        temperature = Math.random() * (5 - -10) + -10;
        precipitation = Math.random() * (15 - 5) + 5;
        windSpeed = Math.random() * 15;
        surgeMultiplier = 1.5;
        break;
      case 'fog':
        temperature = Math.random() * (15 - 5) + 5;
        precipitation = Math.random() * 5;
        windSpeed = Math.random() * 5;
        surgeMultiplier = 1.3;
        break;
      case 'storm':
        temperature = Math.random() * (25 - 15) + 15;
        precipitation = Math.random() * (50 - 20) + 20;
        windSpeed = Math.random() * (40 - 20) + 20;
        surgeMultiplier = 1.8;
        break;
      default:
        temperature = 20;
        precipitation = 0;
        windSpeed = 5;
        surgeMultiplier = 1.0;
    }
    
    // Save weather data to database
    const [result] = await db.query(
      `INSERT INTO weather_data (
        city, weather_condition, temperature, precipitation, wind_speed, surge_multiplier
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        city,
        randomCondition,
        temperature.toFixed(2),
        precipitation.toFixed(2),
        windSpeed.toFixed(2),
        surgeMultiplier.toFixed(2)
      ]
    );
    
    const weatherData = {
      id: result.insertId,
      city,
      weather_condition: randomCondition,
      temperature: temperature.toFixed(2),
      precipitation: precipitation.toFixed(2),
      wind_speed: windSpeed.toFixed(2),
      surge_multiplier: surgeMultiplier.toFixed(2),
      recorded_at: new Date()
    };
    
    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error getting weather data:', error);
    res.status(500).json({ message: 'Failed to get weather data' });
  }
};
