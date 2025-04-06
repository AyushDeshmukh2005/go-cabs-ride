CREATE DATABASE IF NOT EXISTS gocabs;
USE gocabs;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('rider', 'driver', 'admin') NOT NULL DEFAULT 'rider',
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Riders
CREATE TABLE IF NOT EXISTS riders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    rating DECIMAL(3,2) DEFAULT 5.00,
    subscription_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Drivers
CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    vehicle_make VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(50) NOT NULL,
    vehicle_year INT NOT NULL,
    vehicle_color VARCHAR(30) NOT NULL,
    vehicle_plate VARCHAR(20) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 5.00,
    is_active BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    current_location_lat DECIMAL(10, 8),
    current_location_lng DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Admins
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    department VARCHAR(50),
    access_level ENUM('basic', 'supervisor', 'full') DEFAULT 'basic',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Favorite Drivers
CREATE TABLE IF NOT EXISTS favorite_drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rider_id INT NOT NULL,
    driver_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    UNIQUE KEY (rider_id, driver_id)
);

-- Saved Addresses
CREATE TABLE IF NOT EXISTS saved_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_type VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payment Methods
CREATE TABLE IF NOT EXISTS payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    payment_type VARCHAR(50) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    account_number VARCHAR(255) NOT NULL,
    expiry_date VARCHAR(10),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_days INT,
    price DECIMAL(10, 2) NOT NULL,
    ride_limit INT,
    discount_percentage DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    payment_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- Rides
CREATE TABLE IF NOT EXISTS rides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rider_id INT NOT NULL,
    driver_id INT,
    pickup_lat DECIMAL(10, 8) NOT NULL,
    pickup_lng DECIMAL(11, 8) NOT NULL,
    pickup_address VARCHAR(255) NOT NULL,
    destination_lat DECIMAL(10, 8) NOT NULL,
    destination_lng DECIMAL(11, 8) NOT NULL,
    destination_address VARCHAR(255) NOT NULL,
    status ENUM('pending', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    ride_type ENUM('standard', 'premium', 'eco') DEFAULT 'standard',
    estimated_fare DECIMAL(10, 2) NOT NULL,
    final_fare DECIMAL(10, 2),
    distance_km DECIMAL(8, 2),
    duration_minutes INT,
    payment_method_id INT,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    rider_rating DECIMAL(3, 2),
    driver_rating DECIMAL(3, 2),
    carbon_footprint DECIMAL(8, 2),
    silent_ride BOOLEAN DEFAULT FALSE,
    ac_on BOOLEAN DEFAULT TRUE,
    music_preference ENUM('none', 'rider', 'driver') DEFAULT 'none',
    is_pooled BOOLEAN DEFAULT FALSE,
    scheduled_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rider_id) REFERENCES riders(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);

-- Ride Stops
CREATE TABLE IF NOT EXISTS ride_stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT NOT NULL,
    stop_order INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    reached_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE
);

-- Ride Tracking
CREATE TABLE IF NOT EXISTS ride_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE
);

-- Fare Bids
CREATE TABLE IF NOT EXISTS fare_bids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT NOT NULL,
    driver_id INT NOT NULL,
    bid_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- Driver Achievements
CREATE TABLE IF NOT EXISTS driver_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    badge_image VARCHAR(255),
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Earned Achievements
CREATE TABLE IF NOT EXISTS driver_earned_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    achievement_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES driver_achievements(id),
    UNIQUE KEY (driver_id, achievement_id)
);

-- Emergency Contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Emergency Alerts
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT NOT NULL,
    user_id INT NOT NULL,
    alert_type ENUM('driver_swap', 'emergency_contact', 'system_alert') NOT NULL,
    status ENUM('active', 'resolved', 'false_alarm') DEFAULT 'active',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (ride_id) REFERENCES rides(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ✅ FIXED: Weather Data (escaped `condition`)
CREATE TABLE IF NOT EXISTS weather_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    `condition` VARCHAR(50) NOT NULL,
    temperature DECIMAL(5, 2) NOT NULL,
    precipitation DECIMAL(5, 2),
    wind_speed DECIMAL(5, 2),
    recorded_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Traffic Conditions
CREATE TABLE IF NOT EXISTS traffic_conditions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    area_name VARCHAR(100) NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    congestion_level ENUM('low', 'moderate', 'high', 'severe') NOT NULL,
    average_speed DECIMAL(5, 2),
    recorded_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT NOT NULL,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id)
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Driver Reports
CREATE TABLE IF NOT EXISTS driver_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    reported_by INT NOT NULL,
    ride_id INT,
    report_type ENUM('behavior', 'safety', 'cleanliness', 'other') NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending', 'under_review', 'resolved', 'dismissed') DEFAULT 'pending',
    admin_notes TEXT,
    reviewed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (reported_by) REFERENCES users(id),
    FOREIGN KEY (ride_id) REFERENCES rides(id),
    FOREIGN KEY (reviewed_by) REFERENCES admin_users(id)
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_rides_rider_id ON rides(rider_id);
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_drivers_is_active ON drivers(is_active);
CREATE INDEX idx_chat_messages_ride_id ON chat_messages(ride_id);
CREATE INDEX idx_ride_stops_ride_id ON ride_stops(ride_id);

-- Sample subscription plans
INSERT INTO subscription_plans (name, description, duration_days, price, ride_limit, discount_percentage)
VALUES 
('Daily Pass', 'Unlimited rides for 1 day', 1, 9.99, NULL, 15.00),
('Weekly Pass', 'Unlimited rides for 7 days', 7, 49.99, NULL, 20.00),
('Monthly Pass', 'Unlimited rides for 30 days', 30, 149.99, NULL, 25.00),
('10-Ride Package', '10 rides with no expiration', NULL, 99.99, 10, 10.00);

-- Driver Achievements
INSERT INTO driver_achievements (achievement_name, description, badge_image, points)
VALUES 
('Early Bird', 'Complete 5 rides before 9 AM', 'early_bird.png', 50),
('Perfect Rating', 'Maintain a 5-star rating for 20 consecutive rides', 'perfect_rating.png', 100),
('Marathon Driver', 'Complete 100 rides in a month', 'marathon.png', 200),
('City Explorer', 'Complete rides in 10 different neighborhoods', 'explorer.png', 75),
('Eco Warrior', 'Complete 50 rides with eco-friendly vehicles', 'eco_warrior.png', 150);
