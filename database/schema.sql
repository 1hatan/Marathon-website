-- Infinity Run Marathon Database Schema

CREATE DATABASE IF NOT EXISTS infinity_run;
USE infinity_run;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Race Categories Table
CREATE TABLE IF NOT EXISTS race_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  distance VARCHAR(20) NOT NULL,
  description TEXT,
  age_limit VARCHAR(50),
  fee DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Participants Table
CREATE TABLE IF NOT EXISTS participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id VARCHAR(30) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  dob DATE NOT NULL,
  gender VARCHAR(20) NOT NULL,
  blood_group VARCHAR(10) NOT NULL,
  race_category_id INT NOT NULL,
  t_shirt_size VARCHAR(10) NOT NULL,
  emergency_name VARCHAR(100) NOT NULL,
  emergency_mobile VARCHAR(20) NOT NULL,
  emergency_relation VARCHAR(50) NOT NULL,
  medical_info TEXT,
  registration_status VARCHAR(20) DEFAULT 'Confirmed',
  payment_status VARCHAR(20) DEFAULT 'Paid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (race_category_id) REFERENCES race_categories(id) ON DELETE CASCADE
);

-- 4. Sponsors Table
CREATE TABLE IF NOT EXISTS sponsors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo VARCHAR(255) NOT NULL,
  tier VARCHAR(50) NOT NULL,
  website VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(255) NOT NULL,
  title VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. FAQ Table
CREATE TABLE IF NOT EXISTS faq (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(150),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'Unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Event Settings Table
CREATE TABLE IF NOT EXISTS event_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(100) DEFAULT 'Infinity Run',
  event_date VARCHAR(100) DEFAULT 'Sunday, November 15, 2026',
  venue VARCHAR(255) DEFAULT 'Salem Sports Complex & Mahatma Gandhi Stadium',
  location VARCHAR(255) DEFAULT 'Salem, Tamil Nadu',
  reporting_time VARCHAR(100) DEFAULT '05:00 AM',
  flagoff_time VARCHAR(100) DEFAULT '05:30 AM (21K) | 06:00 AM (10K) | 06:30 AM (5K/3K)',
  registration_deadline VARCHAR(100) DEFAULT 'November 10, 2026',
  contact_email VARCHAR(100) DEFAULT 'saleminfo@infinityrun.org',
  contact_phone VARCHAR(50) DEFAULT '+91 98765 43210',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed initial event settings if table is empty
INSERT INTO event_settings (id, event_name, event_date, venue, location, reporting_time, flagoff_time, registration_deadline, contact_email, contact_phone)
SELECT 1, 'Infinity Run', 'Sunday, November 15, 2026', 'Salem Sports Complex & Mahatma Gandhi Stadium', 'Salem, Tamil Nadu', '05:00 AM', '05:30 AM (21K) | 06:00 AM (10K) | 06:30 AM (5K/3K)', 'November 10, 2026', 'saleminfo@infinityrun.org', '+91 98765 43210'
WHERE NOT EXISTS (SELECT 1 FROM event_settings WHERE id = 1);

-- Seed Race Categories if empty
INSERT INTO race_categories (id, name, distance, description, age_limit, fee, status)
VALUES
(1, '3K Fun Run', '3K', 'Ideal for beginners, families, and casual runners looking to be part of the movement.', 'Open to all ages (under 12 with guardian)', 499.00, 'active'),
(2, '5K Run', '5K', 'A popular distance for fitness enthusiasts testing their endurance and speed.', 'Min. 12 years old', 699.00, 'active'),
(3, '10K Challenge', '10K', 'A timed competitive race for seasoned runners seeking speed and endurance.', 'Min. 15 years old', 899.00, 'active'),
(4, '21K Half Marathon', '21K', 'The flagship endurance test with chip timing, pace pacers, and prize purse.', 'Min. 18 years old', 1199.00, 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Initial FAQs if empty
INSERT INTO faq (question, answer, status)
VALUES
('Who can participate in Infinity Run?', 'Infinity Run is open to runners of all fitness levels. The 3K Fun Run welcomes all ages, while timed races (5K, 10K, 21K) have minimum age limits of 12, 15, and 18 years respectively.', 'active'),
('How do I receive my registration confirmation?', 'Upon completing the multi-step online registration, you will receive an instant on-screen digital registration pass with a unique Registration ID (e.g. INF-2026-XXXX). An email confirmation will also be dispatched.', 'active'),
('What is included in the registration fee?', 'Your registration fee includes an official dry-fit running T-shirt, personalized bib with timing chip (for 5K, 10K, 21K), finisher medal, e-certificate, hot breakfast refreshments, and hydration support along the route.', 'active'),
('Where and when can I collect my Bib and Race Kit?', 'Race kit collection will take place at the Marathon Expo (City Sports Complex) on Friday, Nov 13, and Saturday, Nov 14, from 10:00 AM to 6:00 PM. Please bring your registration confirmation ID and photo ID.', 'active'),
('Can I change my race category after registration?', 'Race category transfers can be requested up to 10 days before the event by contacting support with your Registration ID, subject to slot availability.', 'active'),
('What should I bring on race day?', 'Bring your official bib pinned to your chest, comfortable running attire, running shoes, and photo ID. Storage counters for baggage will be available at the venue.', 'active')
ON DUPLICATE KEY UPDATE question=VALUES(question);

-- Seed Initial Sponsors if empty
INSERT INTO sponsors (name, logo, tier, website, status)
VALUES
('Apex Athletics', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80', 'Title Sponsor', 'https://apexathletics.com', 'active'),
('HydroMax Hydration', 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&auto=format&fit=crop&q=80', 'Gold Sponsor', 'https://hydromax.com', 'active'),
('FitNutrition Co.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80', 'Gold Sponsor', 'https://fitnutrition.com', 'active'),
('Pulse Wearables', 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=300&auto=format&fit=crop&q=80', 'Silver Sponsor', 'https://pulsewearables.com', 'active'),
('City HealthCare', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300&auto=format&fit=crop&q=80', 'Supporting Partner', 'https://cityhealthcare.org', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Initial Gallery photos if empty
INSERT INTO gallery (image_url, title, status)
VALUES
('https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80', 'Marathon Flag Off', 'active'),
('https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80', 'Runners at Sunrise', 'active'),
('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80', 'Finisher Celebration', 'active'),
('https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&auto=format&fit=crop&q=80', 'Hydration Point Joy', 'active'),
('https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80', 'Medal Presentation', 'active'),
('https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80', 'Community Spirit', 'active')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Create alias view for infinity_run table references if queried directly
CREATE OR REPLACE VIEW infinity_run AS SELECT * FROM participants;

