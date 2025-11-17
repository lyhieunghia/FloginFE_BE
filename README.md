# Flogin - Login Application

## 📋 Yêu cầu

- **Java 17+**
- **Node.js 14+**
- **MySQL 8.0+**

## 🚀 Hướng dẫn chạy

### 1️⃣ Chuẩn bị Database

```sql
-- Mở MySQL và chạy lệnh sau:
CREATE DATABASE flogin;
```

### 2️⃣ Chạy Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

Backend sẽ chạy tại: **http://localhost:8081**

### 3️⃣ Chạy Frontend (React)

Mở terminal mới:

```bash
cd frontend
npm install
npm start
```

Frontend sẽ mở tại: **http://localhost:3000**

## 🔑 Thông tin đăng nhập

- **Username**: `testuser`
- **Password**: `Test123`

## ⚙️ Cấu hình MySQL

Nếu MySQL của bạn có password khác, sửa file `backend/src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    username: root
    password: YOUR_PASSWORD  # Thay đổi ở đây
```
**Thế là xong! Giờ bạn có thể đăng nhập rồi! 🎉**

