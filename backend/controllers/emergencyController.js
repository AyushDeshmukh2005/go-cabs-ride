
import { pool, executeQuery } from '../config/database.js';
import * as socketStore from '../socket/socketStore.js';

// Enhanced error handler for controllers
const handleControllerError = (res, operation, error) => {
  console.error(`Error in emergency controller (${operation}):`, error);
  
  // Send appropriate error response based on error type
  if (error.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({ 
      message: 'Referenced record does not exist',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } else if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ 
      message: 'A record with this information already exists',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
  
  // Generic error response
  return res.status(500).json({ 
    message: `Failed to ${operation}`,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// Socket.IO safety wrapper
const safeEmit = (io, room, event, data) => {
  if (!io) {
    console.warn(`Socket.IO not available for emitting ${event} to ${room}`);
    return false;
  }
  
  try {
    io.to(room).emit(event, data);
    return true;
  } catch (error) {
    console.error(`Error emitting ${event} to ${room}:`, error);
    return false;
  }
};

// Get user's emergency contacts
export const getUserEmergencyContacts = async (req, res) => {
  try {
    // Validate user ID is present
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User authentication required' });
    }
    
    const [contacts] = await pool.query(
      'SELECT * FROM emergency_contacts WHERE user_id = ?',
      [req.user.id]
    );
    
    res.status(200).json(contacts);
  } catch (error) {
    handleControllerError(res, 'get emergency contacts', error);
  }
};

// Add emergency contact
export const addEmergencyContact = async (req, res) => {
  const { contact_name, contact_phone, contact_relationship } = req.body;
  
  // Input validation
  if (!contact_name || !contact_name.trim()) {
    return res.status(400).json({ message: 'Contact name is required' });
  }
  
  if (!contact_phone || !contact_phone.trim()) {
    return res.status(400).json({ message: 'Contact phone is required' });
  }
  
  try {
    // Add emergency contact
    const [result] = await pool.query(
      'INSERT INTO emergency_contacts (user_id, contact_name, contact_phone, contact_relationship) VALUES (?, ?, ?, ?)',
      [req.user.id, contact_name.trim(), contact_phone.trim(), contact_relationship || null]
    );
    
    // Get the newly created contact
    const [newContact] = await pool.query(
      'SELECT * FROM emergency_contacts WHERE id = ?',
      [result.insertId]
    );
    
    // If no contact was found (unlikely but possible if deleted immediately after creation)
    if (newContact.length === 0) {
      return res.status(404).json({ message: 'Created contact not found' });
    }
    
    // Log the activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [req.user.id, 'EMERGENCY_CONTACT_ADDED', `User added emergency contact: ${contact_name}`]
    );
    
    res.status(201).json(newContact[0]);
  } catch (error) {
    handleControllerError(res, 'add emergency contact', error);
  }
};

// Update emergency contact
export const updateEmergencyContact = async (req, res) => {
  const { id } = req.params;
  const { contact_name, contact_phone, contact_relationship } = req.body;
  
  // Validate ID
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ message: 'Valid contact ID is required' });
  }
  
  // Input validation
  if ((!contact_name || !contact_name.trim()) && (!contact_phone || !contact_phone.trim())) {
    return res.status(400).json({ message: 'At least one of contact name or phone must be provided' });
  }
  
  try {
    // Verify ownership
    const [contactCheck] = await pool.query(
      'SELECT * FROM emergency_contacts WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    if (contactCheck.length === 0) {
      return res.status(404).json({ message: 'Emergency contact not found' });
    }
    
    // Get current values to use if new values not provided
    const currentContact = contactCheck[0];
    
    // Update the contact
    await pool.query(
      'UPDATE emergency_contacts SET contact_name = ?, contact_phone = ?, contact_relationship = ? WHERE id = ?',
      [
        contact_name?.trim() || currentContact.contact_name,
        contact_phone?.trim() || currentContact.contact_phone,
        contact_relationship !== undefined ? contact_relationship : currentContact.contact_relationship,
        id
      ]
    );
    
    // Get the updated contact
    const [updatedContact] = await pool.query(
      'SELECT * FROM emergency_contacts WHERE id = ?',
      [id]
    );
    
    // Log the activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [req.user.id, 'EMERGENCY_CONTACT_UPDATED', `User updated emergency contact ID: ${id}`]
    );
    
    res.status(200).json(updatedContact[0]);
  } catch (error) {
    handleControllerError(res, 'update emergency contact', error);
  }
};

// Delete emergency contact
export const deleteEmergencyContact = async (req, res) => {
  const { id } = req.params;
  
  // Validate ID
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ message: 'Valid contact ID is required' });
  }
  
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
    
    // Log the activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [req.user.id, 'EMERGENCY_CONTACT_DELETED', `User deleted emergency contact ID: ${id}`]
    );
    
    res.status(200).json({ message: 'Emergency contact deleted successfully', id });
  } catch (error) {
    handleControllerError(res, 'delete emergency contact', error);
  }
};

// Send SOS alert
export const sendSOSAlert = async (req, res) => {
  const { ride_id, location, emergency_type, message } = req.body;
  
  // Input validation
  if (!ride_id || isNaN(parseInt(ride_id, 10))) {
    return res.status(400).json({ message: 'Valid ride ID is required' });
  }
  
  if (!location || !location.lat || !location.lng) {
    return res.status(400).json({ message: 'Valid location with latitude and longitude is required' });
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
    
    // Get the global io instance safely
    const io = global.io;
    
    // Safety check for Socket.IO
    if (!io) {
      console.warn('Socket.IO instance not available for emergency alert');
    } else {
      // Notify admins
      safeEmit(io, 'admin', 'emergency_alert', {
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
      safeEmit(io, `ride_${ride_id}`, 'emergency_alert', {
        user_id: req.user.id,
        user_role: req.user.role,
        emergency_type: emergency_type || 'Unspecified',
        message: 'Emergency reported. Help is on the way.',
        timestamp: new Date()
      });
    }
    
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
    handleControllerError(res, 'send emergency alert', error);
  }
};

// Request driver swap in emergency
export const requestDriverSwap = async (req, res) => {
  const { ride_id, reason } = req.body;
  
  // Input validation
  if (!ride_id || isNaN(parseInt(ride_id, 10))) {
    return res.status(400).json({ message: 'Valid ride ID is required' });
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
    
    // Get the global io instance safely
    const io = global.io;
    
    // Safety check for Socket.IO
    if (!io) {
      console.warn('Socket.IO instance not available for driver swap request');
    } else {
      // Notify admins
      safeEmit(io, 'admin', 'driver_swap_request', {
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
        safeEmit(io, driverSocketId, 'ride_update', {
          type: 'swap_requested',
          rideId: ride_id,
          message: 'A driver swap has been requested for this ride.'
        });
      }
    }
    
    res.status(200).json({ 
      message: 'Driver swap request sent successfully',
      ride_id,
      current_driver_id: rideCheck[0].driver_id
    });
  } catch (error) {
    handleControllerError(res, 'request driver swap', error);
  }
};
