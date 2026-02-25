DROP DATABASE IF EXISTS jamaican_heritage;
CREATE DATABASE jamaican_heritage;
USE jamaican_heritage;

-- USERS
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255),
  category VARCHAR(100),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CART
CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ORDERS
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending','paid','shipped','delivered') DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ORDER ITEMS
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- SAMPLE PRODUCTS
INSERT INTO products (name, description, price, image, category, stock)
VALUES
('Authentic Jerk Seasoning','Traditional Jamaican jerk seasoning made with authentic spices.',12.99,'assets/images/jerk.webp','Spices',50),
('Handcrafted Rasta Bracelet','Handwoven bracelet inspired by Jamaican Rastafarian culture.',18.50,'assets/images/bracelet.webp','Art',40),
('Jamaican Straw Hat','Lightweight handmade straw hat perfect for Caribbean sunshine.',25.00,'assets/images/hat.webp','Clothing',30),
('Blue Mountain Coffee','Premium Jamaican Blue Mountain coffee with rich aroma.',22.00,'assets/images/coffee.webp','Spices',20);