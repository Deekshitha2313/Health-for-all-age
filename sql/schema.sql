CREATE DATABASE IF NOT EXISTS health_med_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE health_med_db;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('patient','doctor','admin') NOT NULL DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles
CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  age_group ENUM('kids','teens','adults','seniors','all') NOT NULL DEFAULT 'all',
  author_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  doctor_name VARCHAR(120) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  reason VARCHAR(255),
  status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed sample article
INSERT INTO articles (title, content, age_group) VALUES
('Healthy Habits for All Ages', 'Drink water, move daily, and sleep well.', 'all');
