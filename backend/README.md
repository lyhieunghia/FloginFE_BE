# Flogin Backend - Spring Boot Application

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+ (for development)

### 1️⃣ Clone & Setup

```bash
cd backend
mvn clean install
```

### 2️⃣ Run Application

```bash
mvn spring-boot:run
```

✅ Database `kiem_thu_phan_mem` sẽ **tự động được tạo**!

Backend sẽ chạy tại: **http://localhost:8081**

### 3️⃣ Run Tests

```bash
mvn test
```

✅ Tests sử dụng H2 in-memory database - **không cần MySQL**!

## 📚 API Endpoints

### POST /api/auth/login

**Request:**
```json
{
  "username": "testuser",
  "password": "Test123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "login success",
  "token": "trinh-tran-phuong-tuan"
}
```

**Response (Failure - 401):**
```json
{
  "success": false,
  "message": "username not found"
}
```

## 🗄️ Database Setup

Chi tiết xem file [SETUP_DATABASE.md](./SETUP_DATABASE.md)

### TL;DR:
- **Development**: MySQL tự động tạo database `kiem_thu_phan_mem`
- **Testing**: H2 in-memory (tự động, không cần config)

## 🧪 Testing

### Unit Tests
- AuthServiceTest: Tests business logic
- AuthControllerTest: Tests API endpoints with MockMvc

### Test Coverage
- ✅ Login success
- ✅ Login failure (wrong username/password)
- ✅ Validation errors
- ✅ CORS headers
- ✅ Response structure

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthServiceTest

# Run with coverage
mvn test jacoco:report
```

## 🔧 Configuration

### application.yaml (Main)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/kiem_thu_phan_mem
    username: root
    password: subin123
```

### application-test.yaml (Testing)
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
```

## 📦 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/flogin/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── entity/          # JPA Entities
│   │   │   ├── repository/      # JPA Repositories
│   │   │   └── service/         # Business Logic
│   │   └── resources/
│   │       ├── application.yaml
│   │       └── schema-mysql.sql
│   └── test/
│       ├── java/com/flogin/
│       │   ├── controller/      # Controller Tests
│       │   └── service/         # Service Tests
│       └── resources/
│           ├── application-test.yaml
│           └── test-data.sql
├── pom.xml
└── README.md
```

## 🔑 Demo Credentials

```
Username: testuser
Password: Test123
```

## 🛠️ Build & Deploy

### Build JAR
```bash
mvn clean package
```

### Run JAR
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Build with specific profile
```bash
mvn clean package -Pdev
```

## 📝 Notes

1. Database tự động tạo khi chạy ứng dụng
2. Tests không cần MySQL (sử dụng H2)
3. CORS đã được cấu hình cho frontend (*)
4. JPA tự động tạo/cập nhật tables (ddl-auto: update)

## 🐛 Troubleshooting

Xem file [SETUP_DATABASE.md](./SETUP_DATABASE.md) phần Troubleshooting.

