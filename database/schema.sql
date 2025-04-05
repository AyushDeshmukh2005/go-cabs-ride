
-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('rider', 'driver', 'admin') DEFAULT 'rider',
  profile_image VARCHAR(255),
  license_number VARCHAR(50),
  vehicle_model VARCHAR(100),
  vehicle_color VARCHAR(50),
  vehicle_plate_number VARCHAR(20),
  rating DECIMAL(3,2) DEFAULT 5.00,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Rides Table
CREATE TABLE rides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rider_id INT NOT NULL,
  driver_id INT,
  pickup_location VARCHAR(255) NOT NULL,
  dropoff_location VARCHAR(255) NOT NULL,
  pickup_coordinates VARCHAR(50) NOT NULL,
  dropoff_coordinates VARCHAR(50) NOT NULL,
  status ENUM('requested', 'accepted', 'in_progress', 'completed', 'cancelled', 'negotiating') DEFAULT 'requested',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  estimated_fare DECIMAL(10,2) NOT NULL,
  final_fare DECIMAL(10,2),
  payment_method ENUM('cash', 'card', 'wallet') DEFAULT 'cash',
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  distance_km DECIMAL(10,2) NOT NULL,
  estimated_duration_mins INT NOT NULL,
  ride_type ENUM('standard', 'premium', 'pooled', 'event') DEFAULT 'standard',
  special_instructions TEXT,
  carbon_footprint DECIMAL(10,2),
  weather_factor DECIMAL(3,2) DEFAULT 1.00,
  traffic_factor DECIMAL(3,2) DEFAULT 1.00,
  is_favorite BOOLEAN DEFAULT false,
  mood_settings JSON,
  FOREIGN KEY (rider_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Ride Stops Table
CREATE TABLE ride_stops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ride_id INT NOT NULL,
  stop_address VARCHAR(255) NOT NULL,
  stop_coordinates VARCHAR(50) NOT NULL,
  stop_order INT NOT NULL,
  estimated_arrival TIMESTAMP,
  actual_arrival TIMESTAMP,
  FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE
);

-- Favorite Routes Table
CREATE TABLE favorite_routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  pickup_location VARCHAR(255) NOT NULL,
  dropoff_location VARCHAR(255) NOT NULL,
  pickup_coordinates VARCHAR(50) NOT NULL,
  dropoff_coordinates VARCHAR(50) NOT NULL,
  frequently_used_at ENUM('morning', 'afternoon', 'evening', 'night', 'anytime') DEFAULT 'anytime',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Favorite Drivers Table
CREATE TABLE favorite_drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rider_id INT NOT NULL,
  driver_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rider_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Quiet Hours Table
CREATE TABLE quiet_hours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Landmarks Table
CREATE TABLE landmarks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  coordinates VARCHAR(50) NOT NULL,
  landmark_type ENUM('business', 'restaurant', 'hotel', 'attraction', 'other') NOT NULL,
  city VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Driver Rewards Table
CREATE TABLE driver_rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  driver_id INT NOT NULL,
  reward_points INT DEFAULT 0,
  level VARCHAR(50) DEFAULT 'bronze',
  benefits TEXT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Driver Achievements Table
CREATE TABLE driver_achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  driver_id INT NOT NULL,
  achievement_type ENUM('rides_completed', 'perfect_rating', 'consecutive_days', 'special_event', 'emergency_help'),
  achievement_name VARCHAR(100) NOT NULL,
  description TEXT,
  points_awarded INT DEFAULT 0,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Weather Data Table
CREATE TABLE weather_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  weather_condition ENUM('clear', 'rain', 'snow', 'fog', 'storm'),
  temperature DECIMAL(5,2),
  precipitation DECIMAL(5,2),
  wind_speed DECIMAL(5,2),
  surge_multiplier DECIMAL(3,2) DEFAULT 1.00,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Contacts Table
CREATE TABLE emergency_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  contact_name VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_relationship VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ride_id INT NOT NULL,
  reviewer_id INT NOT NULL,
  reviewee_id INT NOT NULL,
  rating DECIMAL(3,2) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payments Table
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ride_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('cash', 'card', 'wallet') NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  transaction_id VARCHAR(255),
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE
);

-- Ride Optimization Table
CREATE TABLE ride_optimization (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ride_id INT NOT NULL,
  original_route JSON,
  optimized_route JSON,
  traffic_conditions JSON,
  optimization_factor DECIMAL(3,2),
  fuel_saved DECIMAL(5,2),
  time_saved INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE
);

-- Admin Users Table (New for Phase 3)
CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  admin_level ENUM('junior', 'senior', 'super') DEFAULT 'junior',
  permissions JSON,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Driver Reports Table (New for Phase 3)
CREATE TABLE driver_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  driver_id INT NOT NULL,
  report_type ENUM('behavior', 'vehicle', 'safety', 'other'),
  reported_by INT NOT NULL,
  description TEXT NOT NULL,
  status ENUM('pending', 'investigating', 'resolved', 'dismissed') DEFAULT 'pending',
  admin_notes TEXT,
  resolved_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Activity Logs Table (New for Phase 3)
CREATE TABLE activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  activity_type VARCHAR(100) NOT NULL,
  description TEXT,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Messages Table (New for Phase 3)
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ride_id INT NOT NULL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subscription Plans Table (New for Phase 3)
CREATE TABLE subscription_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration_days INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  features JSON,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Subscriptions Table (New for Phase 3)
CREATE TABLE user_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  payment_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE
);
