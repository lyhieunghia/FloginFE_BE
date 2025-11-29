# ⚡ Quick Start Guide - Flogin Backend

## 🎯 TL;DR

```bash
cd backend
mvn test           # ✅ Không cần MySQL - tự động dùng H2
mvn spring-boot:run # ⚠️ Cần MySQL running
```

---

## 🧪 1. Chạy Tests (Không cần MySQL)

### Bước 1: Clone và build

```bash
cd backend
mvn clean install
```

### Bước 2: Chạy tests

```bash
mvn test
```

✅ **Kết quả mong đợi:**

```
Tests run: 20, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

**Giải thích:**
- Tests tự động sử dụng **H2 in-memory database**
- Không cần cài đặt hay cấu hình MySQL
- Database tự động tạo và xóa sau khi test xong

---

## 🚀 2. Chạy Application (Cần MySQL)

### Bước 1: Đảm bảo MySQL đang chạy

```bash
# Windows
net start MySQL80

# Kiểm tra
mysql -u root -p
```

### Bước 2: Cập nhật password MySQL

Sửa file `src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    username: root
    password: YOUR_PASSWORD  # Thay đổi ở đây
```

### Bước 3: Chạy application

```bash
mvn spring-boot:run
```

✅ **Database `kiem_thu_phan_mem` sẽ tự động được tạo!**

```
========================================
🔧 Checking MySQL Database...
========================================
✅ Database connection successful!
📊 Database: kiem_thu_phan_mem
========================================
```

### Bước 4: Test API

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123"}'
```

**Response:**

```json
{
  "success": true,
  "message": "login success",
  "token": "trinh-tran-phuong-tuan"
}
```

---

## 📊 So sánh: `mvn test` vs `mvn spring-boot:run`

| Command | Database | Cần MySQL? | Mục đích |
|---------|----------|------------|----------|
| `mvn test` | H2 (in-memory) | ❌ Không | Chạy tests tự động |
| `mvn spring-boot:run` | MySQL | ✅ Có | Chạy ứng dụng thật |

---

## 🗄️ Tạo Database với data mẫu (Optional)

Nếu muốn có data đầy đủ (users + products):

### Cách 1: Chạy SQL script

```bash
mysql -u root -p < src/main/resources/schema-mysql.sql
```

### Cách 2: Copy-paste vào MySQL

```sql
CREATE DATABASE IF NOT EXISTS kiem_thu_phan_mem;
USE kiem_thu_phan_mem;

-- Users
INSERT INTO users (username, password) VALUES
    ('admin', 'admin123'),
    ('testuser', 'Test123');

-- Products (optional)
INSERT INTO products (product_name, price, quantity, description, category)
VALUES
    ('iPhone 15 Pro', 1099.99, 50, 'Điện thoại iPhone 15 Pro 256GB', 'Điện thoại');
```

---

## 📁 Cấu trúc quan trọng

```
backend/
├── src/
│   ├── main/
│   │   └── resources/
│   │       ├── application.yaml          # Config cho MySQL
│   │       └── schema-mysql.sql          # SQL script tạo database
│   └── test/
│       └── resources/
│           ├── application-test.yaml     # Config cho H2
│           └── test-data.sql             # Test data
├── pom.xml
├── README.md
├── SETUP_DATABASE.md                     # Chi tiết setup database
├── TEST_GUIDE.md                         # Chi tiết testing
└── QUICK_START.md                        # File này
```

---

## 🔑 Demo Credentials

```
Username: testuser
Password: Test123
```

---

## 🐛 Common Issues

### Issue 1: `mvn test` fails với MySQL connection error

**✅ Giải pháp:**

Đảm bảo có `@ActiveProfiles("test")` trong test class:

```java
@ActiveProfiles("test")
class AuthServiceTest { ... }
```

### Issue 2: `mvn spring-boot:run` fails - "Access denied"

**✅ Giải pháp:**

Sửa password trong `application.yaml`:

```yaml
spring:
  datasource:
    password: YOUR_MYSQL_PASSWORD
```

### Issue 3: Database không tự động tạo

**✅ Giải pháp:**

Đảm bảo URL có `createDatabaseIfNotExist=true`:

```yaml
url: jdbc:mysql://localhost:3306/kiem_thu_phan_mem?createDatabaseIfNotExist=true
```

---

## 📚 Đọc thêm

- [SETUP_DATABASE.md](./SETUP_DATABASE.md) - Hướng dẫn chi tiết setup database
- [TEST_GUIDE.md](./TEST_GUIDE.md) - Hướng dẫn chi tiết về testing
- [README.md](./README.md) - Tổng quan dự án

---

## ✅ Checklist

- [ ] Clone repository
- [ ] `mvn clean install`
- [ ] `mvn test` (pass all tests)
- [ ] Cài MySQL 8.0+
- [ ] Cập nhật password trong `application.yaml`
- [ ] `mvn spring-boot:run`
- [ ] Test API với curl/Postman
- [ ] ✨ Done!

