
const { pool } = require('../config/database');
const { io } = global;
const socketStore = require('../socket/socketStore');

// Get user's emergency contacts
exports.getUserEmergencyContacts = async (req, res) => {
  try {
    const [contacts] = await pool.query(
      'SELECT * FROM emergency_contacts WHERE user_id = ?',
      [req.user.id]
    );
    
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error getting emergency contacts:', error);
    res.status(500).json({ message: 'Failed to get emergency contacts' });
  }
};

// Add emergency contact
exports.addEmergencyContact = async (req, res) => {
  const { contact_name, contact_phone, contact_relationship } = req.body;
  
  if (!contact_name || !contact_phone) {
    return res.status(400).json({ message: 'Contact name and phone are required' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO emergency_contacts (user_id, contact_name, contact_phone, contact_relationship) VALUES (?, ?, ?, ?)',
      [req.user.id, contact_name, contact_phone, contact_relationship]
    );
    
    const [newContact] = await pool.query(
      'SELECT * FROM emergency_contacts WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newContact[0]);
  } catch (error) {
    console.error('Error adding emergency contact:', error);
    res.status(500).json({ message: 'Failed to add emergency contact' });
  }
};

// Update emergency contact
exports.updateEmergencyContact = async (req, res) => {
  const { id } = req.params;
  const { contact_name, contact_phone, contact_relationship } = req.body;
  
  try {
    // Verify ownership
    const [contactCheck] = await pool.query(
      'SELECT * FROM emergency_contacts WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    if (contactCheck.length === 0) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }
    
    // Update the contact
    await pool.query(
      'UPDATE emergency_contacts SET contact_name = ?, contact_phone = ?, contact_relationship = ? WHERE id = ?',
      [contact_name, contact_phone, contact_relationship, id]
    );
    
    const [updatedContact] = await pool.query(
      'SELECT * FROM emergency_contacts WHERE id = ?',
      [id]
    );
    
    res.status(200).json(updatedContact[0]);
  } catch (error) {
    console.error('Error updating emergency contact:', error);
    res.status(500).json({ message: 'Failed to update emergency contact' });
  }
};

// Delete emergency contact
exports.deleteEmergencyContact = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Verify ownership
    const [contactCheck] = await pool.query(
      'SELECT * FROM emergency_contacts WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    if (contactCheck.length === 0) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }
    
    // Delete the contact
    await pool.query(
      'DELETE FROM emergency_contacts WHERE id = ?',
      [id]
    );
    
    res.status(200).json({ message: 'Emergency contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    res.status(500).json({ message: 'Failed to delete emergency contact' });
  }
};

// Send SOS alert
exports.sendSOSAlert = async (req, res) => {
  const { ride_id, location, emergency_type, message } = req.body;
  
  if (!ride_id || !location) {
    return res.status(400).json({ message: 'Ride ID and location are required' });
  }
  
  try {
    // Check if the ride exists and the user is part of it
    const [rideCheck] = await pool.query(
      'SELECT * FROM rides WHERE id = ? AND (rider_id = ? OR driver_id = ?)',
      [ride_id, req.user.id, req.user.id]
    );
    
    if (rideCheck.length === 0) {
      return res.status(404).json({ message: 'Ride not found or you are not part of this ride' });
    }
    
    // Log the emergency alert
    const [alertResult] = await pool.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [
        req.user.id,
        'EMERGENCY_ALERT',
        `Emergency alert from ${req.user.role} ID: ${req.user.id}. Ride ID: ${ride_id}. Type: ${emergency_type || 'Unspecified'}. Message: ${message || 'No message'}`
      ]
    );
    
    // Notify admins
    io.to('admin').emit('emergency_alert', {
      alert_id: alertResult.insertId,
      user_id: req.user.id,
      user_role: req.user.role,
      ride_id,
      location,
      emergency_type: emergency_type || 'Unspecified',
      message: message || 'No message',
      timestamp: new Date()
    });
    
    // Notify everyone in the ride
    io.to(`ride_${ride_id}`).emit('emergency_alert', {
      user_id: req.user.id,
      user_role: req.user.role,
      emergency_type: emergency_type || 'Unspecified',
      message: 'Emergency reported. Help is on the way.',
      timestamp: new Date()
    });
    
    // Notify emergency contacts (mock implementation - in a real app, this would send SMS or push notifications)
    const [contacts] = await pool.query(
      'SELECT * FROM emergency_contacts WHERE user_id = ?',
      [req.user.id]
    );
    
    // Log notification to emergency contacts
    if (contacts.length > 0) {
      await pool.query(
        'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
        [
          req.user.id,
          'EMERGENCY_CONTACT_NOTIFICATION',
          `Emergency contacts notified for user ID: ${req.user.id}. Total contacts: ${contacts.length}`
        ]
      );
    }
    
    res.status(200).json({ 
      message: 'Emergency alert sent successfully',
      alert_id: alertResult.insertId,
      contacts_notified: contacts.length
    });
  } catch (error) {
    console.error('Error sending emergency alert:', error);
    res.status(500).json({ message: 'Failed to send emergency alert' });
  }
};

// Request driver swap in emergency
exports.requestDriverSwap = async (req, res) => {
  const { ride_id, reason } = req.body;
  
  if (!ride_id) {
    return res.status(400).json({ message: 'Ride ID is required' });
  }
  
  try {
    // Check if the ride exists and the user is part of it
    const [rideCheck] = await pool.query(
      'SELECT * FROM rides WHERE id = ? AND (rider_id = ? OR driver_id = ?)',
      [ride_id, req.user.id, req.user.id]
    );
    
    if (rideCheck.length === 0) {
      return res.status(404).json({ message: 'Ride not found or you are not part of this ride' });
    }
    
    // Check if ride is in a state where driver can be swapped
    if (!['accepted', 'in_progress'].includes(rideCheck[0].status)) {
      return res.status(400).json({ message: 'Driver can only be swapped for rides in progress' });
    }
    
    // Log the swap request
    await pool.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [
        req.user.id,
        'DRIVER_SWAP_REQUEST',
        `Driver swap requested by ${req.user.role} ID: ${req.user.id}. Ride ID: ${ride_id}. Reason: ${reason || 'Emergency'}`
      ]
    );
    
    // Notify admins
    io.to('admin').emit('driver_swap_request', {
      ride_id,
      requested_by: {
        id: req.user.id,
        role: req.user.role
      },
      current_driver_id: rideCheck[0].driver_id,
      reason: reason || 'Emergency',
      timestamp: new Date()
    });
    
    // Notify the current driver
    const driverSocketId = socketStore.getSocketIdByUserId(rideCheck[0].driver_id);
    if (driverSocketId) {
      io.to(driverSocketId).emit('ride_update', {
        type: 'swap_requested',
        rideId: ride_id,
        message: 'A driver swap has been requested for this ride.'
      });
    }
    
    res.status(200).json({ 
      message: 'Driver swap request sent successfully',
      ride_id,
      current_driver_id: rideCheck[0].driver_id
    });
  } catch (error) {
    console.error('Error requesting driver swap:', error);
    res.status(500).json({ message: 'Failed to request driver swap' });
  }
};
