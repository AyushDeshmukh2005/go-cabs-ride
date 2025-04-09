
const { pool } = require('../config/database');

// Get ride history for a user
const getRideHistory = async (userId) => {
  try {
    // Join rides with multiple tables to get all required data
    const [rows] = await pool.query(`
      SELECT 
        r.id, 
        r.pickup_address, 
        r.destination_address, 
        r.status, 
        r.estimated_fare, 
        r.final_fare,
        r.ride_type,
        r.created_at, 
        r.completed_at,
        r.carbon_footprint,
        r.rider_rating,
        u.name as driver_name,
        pm.payment_type
      FROM 
        rides r
      LEFT JOIN 
        drivers d ON r.driver_id = d.id
      LEFT JOIN 
        users u ON d.user_id = u.id
      LEFT JOIN 
        payment_methods pm ON r.payment_method_id = pm.id
      LEFT JOIN 
        riders ri ON r.rider_id = ri.id
      LEFT JOIN 
        users ru ON ri.user_id = ru.id
      WHERE 
        ru.id = ? AND r.status = 'completed'
      ORDER BY 
        r.completed_at DESC
    `, [userId]);

    // Format data for the frontend
    return rows.map(ride => ({
      id: ride.id,
      date: new Date(ride.completed_at).toISOString().split('T')[0],
      time: new Date(ride.completed_at).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }),
      pickup: ride.pickup_address,
      destination: ride.destination_address,
      driver: ride.driver_name || 'Unknown Driver',
      rating: ride.rider_rating || 5,
      price: `$${ride.final_fare || ride.estimated_fare}`,
      status: ride.status,
      carbon: `${ride.carbon_footprint || '0.0'} kg CO₂`,
      paymentMethod: ride.payment_type || 'Cash'
    }));
  } catch (error) {
    console.error('Error fetching ride history:', error);
    throw error;
  }
};

// Get scheduled rides for a user
const getScheduledRides = async (userId) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.id, 
        r.pickup_address, 
        r.destination_address, 
        r.status, 
        r.estimated_fare,
        r.scheduled_at
      FROM 
        rides r
      LEFT JOIN 
        riders ri ON r.rider_id = ri.id
      LEFT JOIN 
        users ru ON ri.user_id = ru.id
      WHERE 
        ru.id = ? AND r.status = 'pending' AND r.scheduled_at IS NOT NULL
      ORDER BY 
        r.scheduled_at ASC
    `, [userId]);

    // Format data for the frontend
    return rows.map(ride => ({
      id: ride.id,
      date: new Date(ride.scheduled_at).toISOString().split('T')[0],
      time: new Date(ride.scheduled_at).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }),
      pickup: ride.pickup_address,
      destination: ride.destination_address,
      price: `$${ride.estimated_fare}`,
      status: 'scheduled'
    }));
  } catch (error) {
    console.error('Error fetching scheduled rides:', error);
    throw error;
  }
};

// Cancel a scheduled ride
const cancelRide = async (rideId, userId) => {
  try {
    // First, verify this ride belongs to the user
    const [rideCheck] = await pool.query(`
      SELECT r.id
      FROM rides r
      JOIN riders ri ON r.rider_id = ri.id
      WHERE r.id = ? AND ri.user_id = ?
    `, [rideId, userId]);

    if (rideCheck.length === 0) {
      throw new Error('Ride not found or not authorized');
    }

    // Update ride status to cancelled
    await pool.query(`
      UPDATE rides
      SET status = 'cancelled'
      WHERE id = ?
    `, [rideId]);

    return { success: true, message: 'Ride cancelled successfully' };
  } catch (error) {
    console.error('Error cancelling ride:', error);
    throw error;
  }
};

// Book a ride again based on a previous ride
const bookAgain = async (rideId, userId) => {
  try {
    // Get the details of the previous ride
    const [previousRide] = await pool.query(`
      SELECT 
        r.pickup_lat, 
        r.pickup_lng, 
        r.pickup_address,
        r.destination_lat, 
        r.destination_lng, 
        r.destination_address,
        r.ride_type,
        r.payment_method_id
      FROM 
        rides r
      JOIN 
        riders ri ON r.rider_id = ri.id
      WHERE 
        r.id = ? AND ri.user_id = ?
    `, [rideId, userId]);

    if (previousRide.length === 0) {
      throw new Error('Previous ride not found or not authorized');
    }

    const ride = previousRide[0];

    // Create a new ride with the same details
    const [result] = await pool.query(`
      INSERT INTO rides (
        rider_id,
        pickup_lat,
        pickup_lng,
        pickup_address,
        destination_lat,
        destination_lng,
        destination_address,
        status,
        ride_type,
        estimated_fare,
        payment_method_id,
        created_at
      ) VALUES (
        (SELECT id FROM riders WHERE user_id = ?),
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        'pending',
        ?,
        15.00,
        ?,
        NOW()
      )
    `, [
      userId,
      ride.pickup_lat,
      ride.pickup_lng,
      ride.pickup_address,
      ride.destination_lat,
      ride.destination_lng,
      ride.destination_address,
      ride.ride_type,
      ride.payment_method_id
    ]);

    return { 
      success: true, 
      message: 'Ride booked successfully', 
      rideId: result.insertId 
    };
  } catch (error) {
    console.error('Error booking ride again:', error);
    throw error;
  }
};

module.exports = {
  getRideHistory,
  getScheduledRides,
  cancelRide,
  bookAgain
};
