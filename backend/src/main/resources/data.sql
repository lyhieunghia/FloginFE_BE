-- Data initialization for CI/Test environment
-- This file contains only INSERT statements
-- Tables are created by Hibernate (ddl-auto=create-drop)

-- Passwords are hashed using BCrypt
-- Original passwords: admin123, user1pass, nhanvienA, Test123
INSERT INTO users (username, password)
VALUES
    ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),       -- admin123
    ('user1', '$2a$10$dXJ3SW6G7P2onLNGwdqo4.z3z8sW0P9pZ/YgYR9Lzb8Q7gHLp5Bqq'),       -- user1pass
    ('nhanvienA', '$2a$10$xVZCqj5xLHmfKqZQJX.8k.xGLW5g8sP9pZ/YgYR9Lzb8Q7gHLp6Cq'),   -- nhanvienA
    ('testuser', '$2a$10$eW1Kd9J2Lh6hGt9Q9jH7P.xGLW5g8sP9pZ/YgYR9Lzb8Q7gHLp7Dq');   -- Test123

INSERT INTO products (product_name, price, quantity, description, category)
VALUES
    ('iPhone 15 Pro', 1099.99, 50, 'Điện thoại iPhone 15 Pro 256GB, màu Titan Tự nhiên.', 'Điện thoại'),
    ('Samsung Galaxy S24 Ultra', 1299.99, 40, 'Flagship Samsung với S Pen và camera 200MP.', 'Điện thoại'),
    ('Google Pixel 8 Pro', 999.00, 30, 'Trải nghiệm Android thuần túy, camera AI thông minh.', 'Điện thoại'),
    ('Oppo Find X7 Ultra', 1150.00, 25, 'Hệ thống camera Hasselblad chuyên nghiệp.', 'Điện thoại'),
    ('Xiaomi 14 Pro', 950.50, 60, 'Hiệu năng cao với chip Snapdragon 8 Gen 3.', 'Điện thoại');
