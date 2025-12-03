-- Test data for H2 in-memory database
-- Tables are created by Hibernate (ddl-auto=create-drop)
-- This file only contains INSERT statements

-- Test users (plain text passwords for testing)
INSERT INTO users (username, password)
VALUES
    ('admin', 'admin123'),
    ('user1', 'user1pass'),
    ('nhanvienA', 'nhanvienA'),
    ('testuser', 'Test123');

INSERT INTO products (product_name, price, quantity, description, category)
VALUES
    ('iPhone 15 Pro', 1099.99, 50, 'Điện thoại iPhone 15 Pro 256GB, màu Titan Tự nhiên.', 'Điện thoại'),
    ('Samsung Galaxy S24 Ultra', 1299.99, 40, 'Flagship Samsung với S Pen và camera 200MP.', 'Điện thoại'),
    ('Google Pixel 8 Pro', 999.00, 30, 'Trải nghiệm Android thuần túy, camera AI thông minh.', 'Điện thoại'),
    ('Oppo Find X7 Ultra', 1150.00, 25, 'Hệ thống camera Hasselblad chuyên nghiệp.', 'Điện thoại'),
    ('Xiaomi 14 Pro', 950.50, 60, 'Hiệu năng cao với chip Snapdragon 8 Gen 3.', 'Điện thoại');

