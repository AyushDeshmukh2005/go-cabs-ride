
const db = require('../config/db');

// Get all subscription plans (public)
exports.getAllPlans = async (req, res) => {
  try {
    const [plans] = await db.query(
      'SELECT * FROM subscription_plans WHERE is_active = true ORDER BY price ASC'
    );
    
    // Parse JSON features
    plans.forEach(plan => {
      if (plan.features) {
        plan.features = JSON.parse(plan.features);
      }
    });
    
    res.status(200).json(plans);
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    res.status(500).json({ message: 'Failed to get subscription plans' });
  }
};

// Get user's current subscription
exports.getUserSubscription = async (req, res) => {
  try {
    const [subscriptions] = await db.query(
      `SELECT us.*, sp.name as plan_name, sp.description as plan_description, sp.features as plan_features
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = ? AND us.status = 'active' AND us.end_date >= CURDATE()
      ORDER BY us.end_date DESC
      LIMIT 1`,
      [req.user.id]
    );
    
    if (subscriptions.length === 0) {
      return res.status(404).json({ message: 'No active subscription found' });
    }
    
    const subscription = subscriptions[0];
    
    // Parse JSON features
    if (subscription.plan_features) {
      subscription.plan_features = JSON.parse(subscription.plan_features);
    }
    
    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error getting user subscription:', error);
    res.status(500).json({ message: 'Failed to get user subscription' });
  }
};

// Subscribe to a plan
exports.subscribe = async (req, res) => {
  const { planId } = req.params;
  const { payment_method } = req.body;
  
  try {
    // Check if the plan exists
    const [plans] = await db.query(
      'SELECT * FROM subscription_plans WHERE id = ? AND is_active = true',
      [planId]
    );
    
    if (plans.length === 0) {
      return res.status(404).json({ message: 'Subscription plan not found or inactive' });
    }
    
    const plan = plans[0];
    
    // Check if user already has an active subscription
    const [activeSubscriptions] = await db.query(
      'SELECT * FROM user_subscriptions WHERE user_id = ? AND status = "active" AND end_date >= CURDATE()',
      [req.user.id]
    );
    
    if (activeSubscriptions.length > 0) {
      return res.status(400).json({ message: 'You already have an active subscription' });
    }
    
    // Create a new subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration_days);
    
    // Process payment (mock implementation)
    const [paymentResult] = await db.query(
      `INSERT INTO payments (ride_id, amount, payment_method, status, processed_at)
      VALUES (NULL, ?, ?, 'completed', NOW())`,
      [plan.price, payment_method || 'card']
    );
    
    // Create subscription
    const [subscriptionResult] = await db.query(
      `INSERT INTO user_subscriptions (user_id, plan_id, start_date, end_date, payment_id)
      VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.id,
        planId,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        paymentResult.insertId
      ]
    );
    
    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [
        req.user.id,
        'SUBSCRIPTION',
        `Subscribed to plan: ${plan.name} for ${plan.duration_days} days`
      ]
    );
    
    res.status(201).json({
      message: 'Subscription created successfully',
      subscription_id: subscriptionResult.insertId,
      plan_name: plan.name,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      payment_id: paymentResult.insertId
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Failed to create subscription' });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    // Check if user has an active subscription
    const [activeSubscriptions] = await db.query(
      'SELECT * FROM user_subscriptions WHERE user_id = ? AND status = "active" AND end_date >= CURDATE()',
      [req.user.id]
    );
    
    if (activeSubscriptions.length === 0) {
      return res.status(404).json({ message: 'No active subscription found' });
    }
    
    // Cancel the subscription
    await db.query(
      'UPDATE user_subscriptions SET status = "cancelled" WHERE user_id = ? AND status = "active"',
      [req.user.id]
    );
    
    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [
        req.user.id,
        'SUBSCRIPTION',
        'Cancelled subscription'
      ]
    );
    
    res.status(200).json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
};

// Admin: Get all user subscriptions
exports.getAllSubscriptions = async (req, res) => {
  const { status, limit = 100 } = req.query;
  
  let query = `
    SELECT us.*, 
    sp.name as plan_name, sp.price as plan_price,
    u.name as user_name, u.email as user_email
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    JOIN users u ON us.user_id = u.id
  `;
  
  const queryParams = [];
  
  if (status) {
    query += ' WHERE us.status = ?';
    queryParams.push(status);
  }
  
  query += ' ORDER BY us.created_at DESC LIMIT ?';
  queryParams.push(parseInt(limit));
  
  try {
    const [subscriptions] = await db.query(query, queryParams);
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error('Error getting all subscriptions:', error);
    res.status(500).json({ message: 'Failed to get subscriptions' });
  }
};

// Admin: Create subscription plan
exports.createPlan = async (req, res) => {
  const { name, description, duration_days, price, features } = req.body;
  
  if (!name || !duration_days || !price) {
    return res.status(400).json({ message: 'Name, duration days, and price are required' });
  }
  
  try {
    const featuresJson = features ? JSON.stringify(features) : null;
    
    const [result] = await db.query(
      `INSERT INTO subscription_plans (name, description, duration_days, price, features)
      VALUES (?, ?, ?, ?, ?)`,
      [name, description, duration_days, price, featuresJson]
    );
    
    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [
        req.user.id,
        'ADMIN_ACTION',
        `Created subscription plan: ${name}`
      ]
    );
    
    const [newPlan] = await db.query(
      'SELECT * FROM subscription_plans WHERE id = ?',
      [result.insertId]
    );
    
    // Parse JSON features for response
    if (newPlan[0].features) {
      newPlan[0].features = JSON.parse(newPlan[0].features);
    }
    
    res.status(201).json(newPlan[0]);
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    res.status(500).json({ message: 'Failed to create subscription plan' });
  }
};

// Admin: Update subscription plan
exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  const { name, description, duration_days, price, features, is_active } = req.body;
  
  try {
    // Check if plan exists
    const [planCheck] = await db.query(
      'SELECT * FROM subscription_plans WHERE id = ?',
      [id]
    );
    
    if (planCheck.length === 0) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }
    
    const featuresJson = features ? JSON.stringify(features) : planCheck[0].features;
    
    // Update the plan
    await db.query(
      `UPDATE subscription_plans SET 
      name = ?, 
      description = ?, 
      duration_days = ?, 
      price = ?, 
      features = ?,
      is_active = ?
      WHERE id = ?`,
      [
        name || planCheck[0].name,
        description || planCheck[0].description,
        duration_days || planCheck[0].duration_days,
        price || planCheck[0].price,
        featuresJson,
        is_active !== undefined ? is_active : planCheck[0].is_active,
        id
      ]
    );
    
    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [
        req.user.id,
        'ADMIN_ACTION',
        `Updated subscription plan ID: ${id}`
      ]
    );
    
    const [updatedPlan] = await db.query(
      'SELECT * FROM subscription_plans WHERE id = ?',
      [id]
    );
    
    // Parse JSON features for response
    if (updatedPlan[0].features) {
      updatedPlan[0].features = JSON.parse(updatedPlan[0].features);
    }
    
    res.status(200).json(updatedPlan[0]);
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    res.status(500).json({ message: 'Failed to update subscription plan' });
  }
};

// Admin: Delete subscription plan
exports.deletePlan = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if plan exists
    const [planCheck] = await db.query(
      'SELECT * FROM subscription_plans WHERE id = ?',
      [id]
    );
    
    if (planCheck.length === 0) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }
    
    // Check if the plan is in use
    const [subscriptionsCheck] = await db.query(
      'SELECT COUNT(*) as count FROM user_subscriptions WHERE plan_id = ?',
      [id]
    );
    
    if (subscriptionsCheck[0].count > 0) {
      // Instead of deleting, just mark as inactive
      await db.query(
        'UPDATE subscription_plans SET is_active = false WHERE id = ?',
        [id]
      );
      
      // Log activity
      await db.query(
        'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
        [
          req.user.id,
          'ADMIN_ACTION',
          `Deactivated subscription plan ID: ${id} (has ${subscriptionsCheck[0].count} active subscriptions)`
        ]
      );
      
      return res.status(200).json({ 
        message: 'Plan has active subscriptions and was marked as inactive instead of deleted',
        deactivated: true
      });
    }
    
    // Delete the plan if not in use
    await db.query(
      'DELETE FROM subscription_plans WHERE id = ?',
      [id]
    );
    
    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, activity_type, description) VALUES (?, ?, ?)',
      [
        req.user.id,
        'ADMIN_ACTION',
        `Deleted subscription plan ID: ${id}`
      ]
    );
    
    res.status(200).json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    res.status(500).json({ message: 'Failed to delete subscription plan' });
  }
};
