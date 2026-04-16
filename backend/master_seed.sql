-- MASTER SEED SCRIPT FOR EV-CHARGE MICROSERVICES

-- 1. Create missing databases
CREATE DATABASE IF NOT EXISTS analytics_db;
CREATE DATABASE IF NOT EXISTS session_db;
CREATE DATABASE IF NOT EXISTS admin_db;

-- 2. Seed User Service
USE user_db;
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    roles VARCHAR(255),
    vehicle_info VARCHAR(255)
);
INSERT INTO users (username, email, phone, roles, vehicle_info) VALUES 
('john_doe', 'john@example.com', '1234567890', 'ROLE_USER', 'Tesla Model 3'),
('jane_admin', 'jane@example.com', '9876543210', 'ROLE_ADMIN', 'Tata Nexon EV');

-- 3. Seed Auth Service
USE auth_db;
CREATE TABLE IF NOT EXISTS user_credential (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    roles VARCHAR(255)
);
-- password is 'password123' hashed with bcrypt
INSERT INTO user_credential (name, email, password, roles) VALUES 
('John Doe', 'john@example.com', '$2a$10$ByIUiNa.7p77C38865oBkezS9PzVp3yVnNpP7/bNoS1Lp6Y./B8S.', 'ROLE_USER'),
('Jane Admin', 'jane@example.com', '$2a$10$ByIUiNa.7p77C38865oBkezS9PzVp3yVnNpP7/bNoS1Lp6Y./B8S.', 'ROLE_ADMIN');

-- 4. Seed Station Discovery Service
USE station_db;
CREATE TABLE IF NOT EXISTS charging_stations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    address VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    type VARCHAR(50),
    connectors VARCHAR(255),
    ocpp_identity VARCHAR(255)
);
INSERT INTO charging_stations (name, latitude, longitude, address, status, type, connectors, ocpp_identity) VALUES 
('Nexus Mall Station', 12.9347, 77.6111, 'Koramangala, Bangalore', 'AVAILABLE', 'DC', 'CCS2, CHAdeMO', 'SN001'),
('Green Charge Hub', 12.9716, 77.5946, 'MG Road, Bangalore', 'OCCUPIED', 'AC', 'Type 2', 'SN002'),
('Highway Express', 13.0358, 77.5970, 'Hebbal, Bangalore', 'MAINTENANCE', 'DC', 'CCS2', 'SN003');

-- 5. Seed Slot Booking Service
USE booking_db;
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    station_id BIGINT NOT NULL,
    station_name VARCHAR(255) NOT NULL,
    slot_start_time DATETIME NOT NULL,
    slot_end_time DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(50),
    connector_type VARCHAR(50),
    estimated_cost DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version INT DEFAULT 0
);
INSERT INTO bookings (user_id, station_id, station_name, slot_start_time, slot_end_time, status, vehicle_type, connector_type, estimated_cost) VALUES 
(1, 1, 'Nexus Mall Station', '2026-04-10 16:00:00', '2026-04-10 17:00:00', 'CONFIRMED', 'FOUR_WHEELER', 'CCS2', 450.0),
(1, 2, 'Green Charge Hub', '2026-04-11 10:00:00', '2026-04-11 11:30:00', 'PENDING', 'FOUR_WHEELER', 'Type 2', 200.0);

-- 6. Seed Notification Service
USE notification_db;
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    type VARCHAR(50),
    recipient VARCHAR(255),
    subject VARCHAR(255),
    content TEXT,
    status VARCHAR(50),
    error_message VARCHAR(255),
    sent_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO notifications (user_id, type, recipient, subject, content, status) VALUES 
(1, 'EMAIL', 'john@example.com', 'Booking Confirmed', 'Your booking at Nexus Mall is confirmed.', 'SENT'),
(2, 'SMS', '9876543210', NULL, 'Your OTP for login is 4567', 'SENT');

-- 7. Seed Charging Session Service
USE session_db;
CREATE TABLE IF NOT EXISTS charging_session (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    station_id BIGINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    energy_used DOUBLE NOT NULL,
    status VARCHAR(50) NOT NULL,
    cost DOUBLE,
    transaction_id VARCHAR(255)
);
INSERT INTO charging_session (booking_id, user_id, station_id, start_time, end_time, energy_used, status, cost, transaction_id) VALUES 
(1, 1, 1, '2026-03-30 10:00:00', '2026-03-30 11:00:00', 15.5, 'ENDED', 450.0, 'TXN_998877');

-- 8. Seed Analytics Service
USE analytics_db;
CREATE TABLE IF NOT EXISTS analytics_metric (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    station_id VARCHAR(50),
    user_id VARCHAR(50),
    value DOUBLE NOT NULL,
    timestamp DATETIME NOT NULL,
    metadata VARCHAR(255)
);
INSERT INTO analytics_metric (type, station_id, user_id, value, timestamp) VALUES 
('REVENUE', '1', NULL, 12000.50, '2026-04-01 00:00:00'),
('USAGE', '1', NULL, 45.0, '2026-04-01 12:00:00');

-- 9. Seed Admin Service
USE admin_db;
CREATE TABLE IF NOT EXISTS admin_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255),
    admin_id VARCHAR(50),
    target_id VARCHAR(50),
    details VARCHAR(255),
    timestamp DATETIME
);
INSERT INTO admin_log (action, admin_id, target_id, details, timestamp) VALUES 
('UPDATE_STATION', 'admin_1', '1', 'Updated status to AVAILABLE', '2026-04-10 09:00:00');
