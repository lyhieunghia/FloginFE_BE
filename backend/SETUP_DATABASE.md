# Hướng dẫn Setup Database

## 📋 Tổng quan

Dự án hỗ trợ 2 môi trường:
- **Development (dev)**: Sử dụng MySQL thật
- **Testing (test)**: Sử dụng H2 in-memory database

## 🔧 Cách 1: Tự động tạo database (Khuyến nghị)

### Bước 1: Đảm bảo MySQL đang chạy

```bash
# Kiểm tra MySQL service
net start MySQL80  # Windows
```

### Bước 2: Chạy ứng dụng

```bash
cd backend
mvn spring-boot:run
```

✅ Database `kiem_thu_phan_mem` sẽ **tự động được tạo** nhờ tham số:
```
createDatabaseIfNotExist=true
```

## 🧪 Chạy Tests

### Tests sử dụng H2 Database (không cần MySQL)

```bash
cd backend
mvn test
```

✅ **Không cần cấu hình gì thêm!** Tests sẽ tự động:
1. Sử dụng H2 in-memory database
2. Tạo tables từ JPA entities
3. Insert test data từ `test-data.sql`
4. Xóa database sau khi test xong

## 🗄️ Cách 2: Tạo database thủ công bằng SQL

Nếu muốn tạo database với data mẫu đầy đủ (bao gồm products):

### Bước 1: Mở MySQL Command Line

```bash
mysql -u root -p
```

### Bước 2: Chạy script SQL

```sql
CREATE DATABASE IF NOT EXISTS kiem_thu_phan_mem;

USE kiem_thu_phan_mem;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    description TEXT,
    category VARCHAR(100)
);

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
```

## 🔑 Cấu hình MySQL

### Nếu password khác, sửa file `application.yaml`:

```yaml
spring:
  datasource:
    username: root
    password: YOUR_PASSWORD  # Thay đổi ở đây
```

## 📁 Cấu trúc files

```
backend/src/
├── main/
│   ├── resources/
│   │   ├── application.yaml            # Main config (sử dụng MySQL)
│   │   ├── application-dev.yaml        # Development config
│   │   └── schema-mysql.sql            # SQL script cho MySQL
│   └── java/com/flogin/config/
│       └── DatabaseInitializer.java    # Kiểm tra & log database
└── test/
    └── resources/
        ├── application-test.yaml       # Test config (sử dụng H2)
        └── test-data.sql               # Test data
```

## 🎯 Profiles

### Chạy với profile cụ thể:

```bash
# Development (MySQL)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Production (MySQL)
mvn spring-boot:run

# Testing (H2 - tự động)
mvn test
```

## ✅ Kiểm tra kết nối

Sau khi chạy ứng dụng, xem log:

```
========================================
🔧 Checking MySQL Database...
========================================
✅ Database connection successful!
📊 Database: kiem_thu_phan_mem
🔗 URL: jdbc:mysql://localhost:3306/kiem_thu_phan_mem...
✅ Table 'users' already exists
========================================
```

## 🐛 Troubleshooting

### Lỗi: `Access denied for user 'root'@'localhost'`

**Giải pháp**: Sửa password trong `application.yaml`

### Lỗi: `Unknown database 'kiem_thu_phan_mem'`

**Giải pháp**: Đảm bảo URL có `createDatabaseIfNotExist=true`

```yaml
url: jdbc:mysql://localhost:3306/kiem_thu_phan_mem?createDatabaseIfNotExist=true
```

### Tests fail với MySQL connection error

**Giải pháp**: Tests không cần MySQL! Chúng sử dụng H2. Kiểm tra:
- File `application-test.yaml` tồn tại trong `src/test/resources/`
- Dependency H2 có trong `pom.xml` với `<scope>test</scope>`

## 📝 Notes

1. **Tests tự động sử dụng H2** - không cần MySQL khi chạy `mvn test`
2. **Development tự động tạo database** - chỉ cần MySQL đang chạy
3. **Production data** - Chạy `schema-mysql.sql` để có data đầy đủ (users + products)

