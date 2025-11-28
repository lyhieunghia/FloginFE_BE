-- Test data initialization script
-- This will run automatically when running tests

-- Insert test users
INSERT INTO users (id, username, password) VALUES 
    (1, 'testuser', 'Test123'),
    (2, 'admin', 'admin123'),
    (3, 'user1', 'user1pass'),
    (4, 'nhanvienA', 'nhanvienA');

-- Create products table if using JPA entities (optional for future)
-- Note: If you create Product entity later, add test data here

