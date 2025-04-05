
const db = require('../config/db');
const { io } = require('../server');

// Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const [drivers] = await db.query(
      `SELECT id, name, email, phone, profile_image, license_number, 
      vehicle_model, vehicle_color, vehicle_plate_number, rating, 
      is_verified, is_active, created_at 
      FROM users WHERE role = 'driver'`
    );
    
    res.status(200).json(drivers);
  } catch (error) {
    console.error('Error getting drivers:', error);
    res.status(500).json({ message: 'Failed to get drivers' });
  }
};

// Get pending drivers awaiting verification
exports.getPendingDrivers = async (req, res) => {
  try {
    const [drivers] = await db.query(
      `SELECT id, name, email, phone, profile_image, license_number, 
      vehicle_model, vehicle_color, vehicle_plate_number, created_at 
      FROM users WHERE role = 'driver' AND is_verified = false AND is_active = true`
    );
    
    res.status(200).json(drivers);
  } catch (error) {
    console.error('Error getting pending drivers:', error);
    res.status(500).json({ message: 'Failed to get pending drivers' });
  }
};

// Verify a driver
exports.verifyDriver = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await db.query(
      'UPDATE users SET is_verified = true WHERE id = ? AND role = "driver"',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [req.user.id, 'ADMIN_ACTION', `Verified driver ID: ${id}`]
    );
    
    // Notify the driver
    const driverSocketId = require('../socket/socketStore').getSocketIdByUserId(id);
    if (driverSocketId) {
      io.to(driverSocketId).emit('account_update', {
        type: 'verification',
        message: 'Your account has been verified! You can now start accepting rides.'
      });
    }
    
    res.status(200).json({ message: 'Driver verified successfully' });
  } catch (error) {
    console.error('Error verifying driver:', error);
    res.status(500).json({ message: 'Failed to verify driver' });
  }
};

// Block a driver
exports.blockDriver = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  
  try {
    const [result] = await db.query(
      'UPDATE users SET is_active = false WHERE id = ? AND role = "driver"',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [req.user.id, 'ADMIN_ACTION', `Blocked driver ID: ${id}. Reason: ${reason || 'Not provided'}`]
    );
    
    // Notify the driver
    const driverSocketId = require('../socket/socketStore').getSocketIdByUserId(id);
    if (driverSocketId) {
      io.to(driverSocketId).emit('account_update', {
        type: 'block',
        message: 'Your account has been blocked. Please contact support for more information.'
      });
    }
    
    res.status(200).json({ message: 'Driver blocked successfully' });
  } catch (error) {
    console.error('Error blocking driver:', error);
    res.status(500).json({ message: 'Failed to block driver' });
  }
};

// Unblock a driver
exports.unblockDriver = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await db.query(
      'UPDATE users SET is_active = true WHERE id = ? AND role = "driver"',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [req.user.id, 'ADMIN_ACTION', `Unblocked driver ID: ${id}`]
    );
    
    // Notify the driver
    const driverSocketId = require('../socket/socketStore').getSocketIdByUserId(id);
    if (driverSocketId) {
      io.to(driverSocketId).emit('account_update', {
        type: 'unblock',
        message: 'Your account has been unblocked. You can now use the app again.'
      });
    }
    
    res.status(200).json({ message: 'Driver unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking driver:', error);
    res.status(500).json({ message: 'Failed to unblock driver' });
  }
};

// Get all riders
exports.getAllRiders = async (req, res) => {
  try {
    const [riders] = await db.query(
      `SELECT id, name, email, phone, profile_image, rating, is_active, created_at 
      FROM users WHERE role = 'rider'`
    );
    
    res.status(200).json(riders);
  } catch (error) {
    console.error('Error getting riders:', error);
    res.status(500).json({ message: 'Failed to get riders' });
  }
};

// Block a rider
exports.blockRider = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  
  try {
    const [result] = await db.query(
      'UPDATE users SET is_active = false WHERE id = ? AND role = "rider"',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rider not found' });
    }
    
    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [req.user.id, 'ADMIN_ACTION', `Blocked rider ID: ${id}. Reason: ${reason || 'Not provided'}`]
    );
    
    // Notify the rider
    const riderSocketId = require('../socket/socketStore').getSocketIdByUserId(id);
    if (riderSocketId) {
      io.to(riderSocketId).emit('account_update', {
        type: 'block',
        message: 'Your account has been blocked. Please contact support for more information.'
      });
    }
    
    res.status(200).json({ message: 'Rider blocked successfully' });
  } catch (error) {
    console.error('Error blocking rider:', error);
    res.status(500).json({ message: 'Failed to block rider' });
  }
};

// Unblock a rider
exports.unblockRider = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await db.query(
      'UPDATE users SET is_active = true WHERE id = ? AND role = "rider"',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rider not found' });
    }
    
    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [req.user.id, 'ADMIN_ACTION', `Unblocked rider ID: ${id}`]
    );
    
    // Notify the rider
    const riderSocketId = require('../socket/socketStore').getSocketIdByUserId(id);
    if (riderSocketId) {
      io.to(riderSocketId).emit('account_update', {
        type: 'unblock',
        message: 'Your account has been unblocked. You can now use the app again.'
      });
    }
    
    res.status(200).json({ message: 'Rider unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking rider:', error);
    res.status(500).json({ message: 'Failed to unblock rider' });
  }
};

// Get all rides
exports.getAllRides = async (req, res) => {
  const { status, date, limit = 100 } = req.query;
  
  let query = `
    SELECT r.id, r.rider_id, r.driver_id, r.pickup_location, r.dropoff_location, 
    r.status, r.requested_at, r.completed_at, r.estimated_fare, r.final_fare, 
    r.payment_method, r.payment_status, r.distance_km, 
    u1.name as rider_name, u2.name as driver_name 
    FROM rides r 
    JOIN users u1 ON r.rider_id = u1.id 
    LEFT JOIN users u2 ON r.driver_id = u2.id
  `;
  
  const queryParams = [];
  
  if (status) {
    query += ' WHERE r.status = ?';
    queryParams.push(status);
  }
  
  if (date) {
    const dateCondition = status ? ' AND' : ' WHERE';
    query += `${dateCondition} DATE(r.requested_at) = ?`;
    queryParams.push(date);
  }
  
  query += ' ORDER BY r.requested_at DESC LIMIT ?';
  queryParams.push(parseInt(limit));
  
  try {
    const [rides] = await db.query(query, queryParams);
    res.status(200).json(rides);
  } catch (error) {
    console.error('Error getting rides:', error);
    res.status(500).json({ message: 'Failed to get rides' });
  }
};

// Get active rides
exports.getActiveRides = async (req, res) => {
  try {
    const [rides] = await db.query(
      `SELECT r.id, r.rider_id, r.driver_id, r.pickup_location, r.dropoff_location, 
      r.status, r.requested_at, r.estimated_fare, r.distance_km, r.estimated_duration_mins,
      u1.name as rider_name, u1.phone as rider_phone, 
      u2.name as driver_name, u2.phone as driver_phone, u2.vehicle_model, u2.vehicle_color, u2.vehicle_plate_number
      FROM rides r 
      JOIN users u1 ON r.rider_id = u1.id 
      LEFT JOIN users u2 ON r.driver_id = u2.id
      WHERE r.status IN ('requested', 'accepted', 'in_progress', 'negotiating')
      ORDER BY r.requested_at ASC`
    );
    
    res.status(200).json(rides);
  } catch (error) {
    console.error('Error getting active rides:', error);
    res.status(500).json({ message: 'Failed to get active rides' });
  }
};

// Get ride details
exports.getRideDetails = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get ride details
    const [rides] = await db.query(
      `SELECT r.*, 
      u1.name as rider_name, u1.phone as rider_phone, u1.email as rider_email,
      u2.name as driver_name, u2.phone as driver_phone, u2.email as driver_email,
      u2.vehicle_model, u2.vehicle_color, u2.vehicle_plate_number
      FROM rides r 
      JOIN users u1 ON r.rider_id = u1.id 
      LEFT JOIN users u2 ON r.driver_id = u2.id
      WHERE r.id = ?`,
      [id]
    );
    
    if (rides.length === 0) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Get ride stops
    const [stops] = await db.query(
      'SELECT * FROM ride_stops WHERE ride_id = ? ORDER BY stop_order',
      [id]
    );
    
    // Get ride reviews
    const [reviews] = await db.query(
      `SELECT rv.*, u.name as reviewer_name 
      FROM reviews rv 
      JOIN users u ON rv.reviewer_id = u.id 
      WHERE rv.ride_id = ?`,
      [id]
    );
    
    // Get ride payments
    const [payments] = await db.query(
      'SELECT * FROM payments WHERE ride_id = ?',
      [id]
    );
    
    // Get ride optimization
    const [optimization] = await db.query(
      'SELECT * FROM ride_optimization WHERE ride_id = ?',
      [id]
    );
    
    const rideData = {
      ...rides[0],
      stops,
      reviews,
      payments,
      optimization: optimization[0] || null
    };
    
    res.status(200).json(rideData);
  } catch (error) {
    console.error('Error getting ride details:', error);
    res.status(500).json({ message: 'Failed to get ride details' });
  }
};

// Reassign a ride to another driver
exports.reassignRide = async (req, res) => {
  const { id } = req.params;
  const { newDriverId, reason } = req.body;
  
  if (!newDriverId) {
    return res.status(400).json({ message: 'New driver ID is required' });
  }
  
  try {
    // Check if the ride exists and is in a state that can be reassigned
    const [rideCheck] = await db.query(
      'SELECT * FROM rides WHERE id = ? AND status IN ("accepted", "in_progress")',
      [id]
    );
    
    if (rideCheck.length === 0) {
      return res.status(404).json({ message: 'Ride not found or cannot be reassigned' });
    }
    
    const currentRide = rideCheck[0];
    
    // Check if the new driver exists, is verified and active
    const [driverCheck] = await db.query(
      'SELECT * FROM users WHERE id = ? AND role = "driver" AND is_verified = true AND is_active = true',
      [newDriverId]
    );
    
    if (driverCheck.length === 0) {
      return res.status(400).json({ message: 'New driver not found or not available' });
    }
    
    // Update the ride with the new driver
    await db.query(
      'UPDATE rides SET driver_id = ?, status = "accepted" WHERE id = ?',
      [newDriverId, id]
    );
    
    // Log the reassignment
    await db.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [
        req.user.id,
        'RIDE_REASSIGNED',
        `Ride ID: ${id} reassigned from driver ID: ${currentRide.driver_id} to driver ID: ${newDriverId}. Reason: ${reason || 'Emergency reassignment'}`
      ]
    );
    
    // Notify the previous driver
    const prevDriverSocketId = require('../socket/socketStore').getSocketIdByUserId(currentRide.driver_id);
    if (prevDriverSocketId) {
      io.to(prevDriverSocketId).emit('ride_update', {
        type: 'reassigned',
        rideId: id,
        message: 'This ride has been reassigned to another driver.'
      });
    }
    
    // Notify the new driver
    const newDriverSocketId = require('../socket/socketStore').getSocketIdByUserId(newDriverId);
    if (newDriverSocketId) {
      io.to(newDriverSocketId).emit('ride_update', {
        type: 'assigned',
        rideId: id,
        message: 'A ride has been assigned to you.'
      });
    }
    
    // Notify the rider
    const riderSocketId = require('../socket/socketStore').getSocketIdByUserId(currentRide.rider_id);
    if (riderSocketId) {
      io.to(riderSocketId).emit('ride_update', {
        type: 'driver_changed',
        rideId: id,
        message: 'Your driver has been changed.'
      });
    }
    
    // Notify everyone in the ride room
    io.to(`ride_${id}`).emit('ride_status_changed', {
      status: 'accepted',
      message: 'Ride has been reassigned to a new driver',
      timestamp: new Date()
    });
    
    res.status(200).json({ message: 'Ride reassigned successfully' });
  } catch (error) {
    console.error('Error reassigning ride:', error);
    res.status(500).json({ message: 'Failed to reassign ride' });
  }
};

// Cancel a ride (admin override)
exports.cancelRide = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  
  try {
    // Check if the ride exists and is in a state that can be cancelled
    const [rideCheck] = await db.query(
      'SELECT * FROM rides WHERE id = ? AND status IN ("requested", "accepted", "in_progress", "negotiating")',
      [id]
    );
    
    if (rideCheck.length === 0) {
      return res.status(404).json({ message: 'Ride not found or cannot be cancelled' });
    }
    
    const currentRide = rideCheck[0];
    
    // Update the ride status
    await db.query(
      'UPDATE rides SET status = "cancelled" WHERE id = ?',
      [id]
    );
    
    // Log the cancellation
    await db.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [
        req.user.id,
        'RIDE_CANCELLED',
        `Ride ID: ${id} cancelled by admin. Reason: ${reason || 'Admin cancellation'}`
      ]
    );
    
    // Notify the driver if assigned
    if (currentRide.driver_id) {
      const driverSocketId = require('../socket/socketStore').getSocketIdByUserId(currentRide.driver_id);
      if (driverSocketId) {
        io.to(driverSocketId).emit('ride_update', {
          type: 'cancelled',
          rideId: id,
          message: 'This ride has been cancelled by the admin.'
        });
      }
    }
    
    // Notify the rider
    const riderSocketId = require('../socket/socketStore').getSocketIdByUserId(currentRide.rider_id);
    if (riderSocketId) {
      io.to(riderSocketId).emit('ride_update', {
        type: 'cancelled',
        rideId: id,
        message: 'Your ride has been cancelled by the admin.'
      });
    }
    
    // Notify everyone in the ride room
    io.to(`ride_${id}`).emit('ride_status_changed', {
      status: 'cancelled',
      message: 'Ride has been cancelled by an administrator',
      timestamp: new Date()
    });
    
    res.status(200).json({ message: 'Ride cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling ride:', error);
    res.status(500).json({ message: 'Failed to cancel ride' });
  }
};

// Get driver reports
exports.getDriverReports = async (req, res) => {
  try {
    const [reports] = await db.query(
      `SELECT dr.*, 
      u1.name as driver_name, u1.email as driver_email,
      u2.name as reported_by_name, 
      u3.name as resolved_by_name
      FROM driver_reports dr
      JOIN users u1 ON dr.driver_id = u1.id
      JOIN users u2 ON dr.reported_by = u2.id
      LEFT JOIN users u3 ON dr.resolved_by = u3.id
      ORDER BY dr.created_at DESC`
    );
    
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error getting driver reports:', error);
    res.status(500).json({ message: 'Failed to get driver reports' });
  }
};

// Get rider reports
exports.getRiderReports = async (req, res) => {
  try {
    const [reports] = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, COUNT(r.id) as total_rides,
      AVG(rev.rating) as avg_rating,
      COUNT(CASE WHEN r.status = 'cancelled' THEN 1 END) as cancelled_rides,
      SUM(p.amount) as total_spent
      FROM users u
      LEFT JOIN rides r ON u.id = r.rider_id
      LEFT JOIN reviews rev ON u.id = rev.reviewee_id
      LEFT JOIN payments p ON r.id = p.ride_id
      WHERE u.role = 'rider'
      GROUP BY u.id, u.name, u.email, u.phone
      ORDER BY total_rides DESC`
    );
    
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error getting rider reports:', error);
    res.status(500).json({ message: 'Failed to get rider reports' });
  }
};

// Get revenue reports
exports.getRevenueReports = async (req, res) => {
  const { period = 'daily', startDate, endDate } = req.query;
  
  let timeFormat;
  switch(period) {
    case 'hourly':
      timeFormat = '%Y-%m-%d %H:00:00';
      break;
    case 'daily':
      timeFormat = '%Y-%m-%d';
      break;
    case 'weekly':
      timeFormat = '%Y-%u';
      break;
    case 'monthly':
      timeFormat = '%Y-%m';
      break;
    default:
      timeFormat = '%Y-%m-%d';
  }
  
  let query = `
    SELECT 
      DATE_FORMAT(p.created_at, '${timeFormat}') as time_period,
      COUNT(p.id) as transaction_count,
      SUM(p.amount) as total_revenue,
      AVG(p.amount) as average_transaction
    FROM payments p
    JOIN rides r ON p.ride_id = r.id
    WHERE p.status = 'completed'
  `;
  
  const queryParams = [];
  
  if (startDate) {
    query += ' AND p.created_at >= ?';
    queryParams.push(startDate);
  }
  
  if (endDate) {
    query += ' AND p.created_at <= ?';
    queryParams.push(endDate);
  }
  
  query += ` GROUP BY time_period ORDER BY time_period DESC`;
  
  try {
    const [revenue] = await db.query(query, queryParams);
    
    // Calculate totals
    const totalRevenue = revenue.reduce((sum, item) => sum + parseFloat(item.total_revenue), 0);
    const totalTransactions = revenue.reduce((sum, item) => sum + parseInt(item.transaction_count), 0);
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    res.status(200).json({
      data: revenue,
      summary: {
        totalRevenue,
        totalTransactions,
        averageTransaction
      }
    });
  } catch (error) {
    console.error('Error getting revenue reports:', error);
    res.status(500).json({ message: 'Failed to get revenue reports' });
  }
};

// Get activity logs
exports.getActivityLogs = async (req, res) => {
  const { limit = 100, activityType } = req.query;
  
  let query = `
    SELECT al.*, u.name as user_name, u.role as user_role
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
  `;
  
  const queryParams = [];
  
  if (activityType) {
    query += ' WHERE al.activity_type = ?';
    queryParams.push(activityType);
  }
  
  query += ' ORDER BY al.created_at DESC LIMIT ?';
  queryParams.push(parseInt(limit));
  
  try {
    const [logs] = await db.query(query, queryParams);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error getting activity logs:', error);
    res.status(500).json({ message: 'Failed to get activity logs' });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get user stats
    const [userStats] = await db.query(`
      SELECT 
        COUNT(CASE WHEN role = 'rider' THEN 1 END) as total_riders,
        COUNT(CASE WHEN role = 'driver' THEN 1 END) as total_drivers,
        COUNT(CASE WHEN role = 'driver' AND is_verified = true THEN 1 END) as verified_drivers,
        COUNT(CASE WHEN role = 'driver' AND is_verified = false THEN 1 END) as pending_drivers,
        COUNT(CASE WHEN is_active = false THEN 1 END) as blocked_users
      FROM users
    `);
    
    // Get ride stats
    const [rideStats] = await db.query(`
      SELECT 
        COUNT(id) as total_rides,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_rides,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_rides,
        COUNT(CASE WHEN status IN ('requested', 'accepted', 'in_progress', 'negotiating') THEN 1 END) as active_rides,
        AVG(final_fare) as average_fare,
        SUM(distance_km) as total_distance
      FROM rides
    `);
    
    // Get revenue stats
    const [revenueStats] = await db.query(`
      SELECT 
        SUM(amount) as total_revenue,
        COUNT(id) as total_transactions
      FROM payments
      WHERE status = 'completed'
    `);
    
    // Get today's stats
    const today = new Date().toISOString().split('T')[0];
    const [todayStats] = await db.query(`
      SELECT 
        COUNT(r.id) as today_rides,
        SUM(p.amount) as today_revenue
      FROM rides r
      LEFT JOIN payments p ON r.id = p.ride_id AND p.status = 'completed'
      WHERE DATE(r.requested_at) = ?
    `, [today]);
    
    res.status(200).json({
      users: userStats[0],
      rides: rideStats[0],
      revenue: revenueStats[0],
      today: todayStats[0]
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Failed to get dashboard stats' });
  }
};

// Get recent activity for the admin dashboard
exports.getRecentActivity = async (req, res) => {
  try {
    // Get recent rides
    const [recentRides] = await db.query(`
      SELECT r.id, r.status, r.requested_at, r.estimated_fare, r.final_fare,
        u1.name as rider_name, u2.name as driver_name
      FROM rides r
      JOIN users u1 ON r.rider_id = u1.id
      LEFT JOIN users u2 ON r.driver_id = u2.id
      ORDER BY r.requested_at DESC
      LIMIT 10
    `);
    
    // Get recent users
    const [recentUsers] = await db.query(`
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    // Get recent payments
    const [recentPayments] = await db.query(`
      SELECT p.id, p.amount, p.status, p.created_at, r.id as ride_id,
        u.name as rider_name
      FROM payments p
      JOIN rides r ON p.ride_id = r.id
      JOIN users u ON r.rider_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 10
    `);
    
    // Get recent activity logs
    const [recentLogs] = await db.query(`
      SELECT al.*, u.name as user_name, u.role as user_role
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 10
    `);
    
    res.status(200).json({
      rides: recentRides,
      users: recentUsers,
      payments: recentPayments,
      logs: recentLogs
    });
  } catch (error) {
    console.error('Error getting recent activity:', error);
    res.status(500).json({ message: 'Failed to get recent activity' });
  }
};
