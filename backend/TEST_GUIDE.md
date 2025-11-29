# 🧪 Hướng dẫn Testing - Flogin Backend

## ✅ Tổng quan

Dự án đã được cấu hình để **tự động tạo database khi chạy tests**:

- ✅ **Tests không cần MySQL** - Sử dụng H2 in-memory database
- ✅ **Database tự động tạo** - Hibernate tạo tables từ JPA entities
- ✅ **Test data tự động insert** - Từ file `test-data.sql`
- ✅ **Database tự động xóa** - Sau khi tests xong

## 🚀 Cách chạy Tests

### Chạy tất cả tests

```bash
cd backend
mvn test
```

**Output mong đợi:**

```
Tests run: 20, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

### Chạy test cụ thể

```bash
# Chỉ chạy Service tests
mvn test -Dtest=AuthServiceTest

# Chỉ chạy Controller tests
mvn test -Dtest=AuthControllerTest

# Chạy một test method cụ thể
mvn test -Dtest=AuthServiceTest#testLoginSuccess
```

### Chạy tests với output chi tiết

```bash
mvn test -X
```

## 🗄️ Cấu hình Database cho Tests

### File: `src/test/resources/application-test.yaml`

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb;MODE=MySQL
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  
  jpa:
    hibernate:
      ddl-auto: create-drop  # Tự động tạo và xóa tables
```

**Giải thích:**
- `jdbc:h2:mem:testdb` - Database in-memory (RAM)
- `MODE=MySQL` - H2 mô phỏng MySQL syntax
- `create-drop` - Tạo tables khi start, xóa khi kết thúc

### File: `src/test/resources/test-data.sql`

```sql
INSERT INTO users (id, username, password) VALUES 
    (1, 'testuser', 'Test123'),
    (2, 'admin', 'admin123');
```

**Note:** File này tự động chạy sau khi Hibernate tạo tables.

## 📊 Test Coverage

### AuthServiceTest (5 tests)

✅ **TC1**: Login thành công với credentials hợp lệ
✅ **TC2**: Login thất bại với username không tồn tại  
✅ **TC3**: Login thất bại với password sai
✅ **TC4**: Validation error khi username rỗng
✅ **TC5**: Validation error khi password rỗng

### AuthControllerTest (15 tests)

✅ **TC1**: Login thành công trả về 200 OK + token header
✅ **TC2**: Login thất bại (username) trả về 401 Unauthorized
✅ **TC3**: Login thất bại (password) trả về 401 Unauthorized
✅ **TC4**: Validation lỗi trả về 400 Bad Request
✅ **TC5-TC15**: CORS headers, response structure, custom headers...

## 🔍 Workflow khi chạy `mvn test`

```
1. Maven khởi động test environment
   ↓
2. Spring Boot load @ActiveProfiles("test")
   ↓
3. Đọc application-test.yaml (không phải application.yaml)
   ↓
4. H2 database khởi động in-memory
   ↓
5. Hibernate tạo tables từ @Entity classes
   ↓
6. Spring chạy test-data.sql để insert data
   ↓
7. Các test classes chạy
   ↓
8. Tests hoàn thành
   ↓
9. H2 database tự động xóa (create-drop)
   ↓
10. ✅ Done!
```

## 🎯 So sánh Development vs Testing

| Aspect | Development | Testing |
|--------|-------------|---------|
| Database | MySQL (localhost:3306) | H2 (in-memory) |
| Database Name | `kiem_thu_phan_mem` | `testdb` |
| Port | 8081 | N/A (no server) |
| Config File | `application.yaml` | `application-test.yaml` |
| DDL Mode | `update` (giữ lại data) | `create-drop` (xóa sau test) |
| Cần MySQL? | ✅ Có | ❌ Không |

## 📦 Dependencies (pom.xml)

```xml
<!-- H2 for testing only -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

**Note:** `<scope>test</scope>` nghĩa là H2 chỉ dùng cho tests, không đóng gói vào production JAR.

## 🐛 Troubleshooting

### Lỗi: Tests fail với "Table not found"

**Nguyên nhân**: `test-data.sql` chạy trước khi Hibernate tạo tables.

**Giải pháp**: Đảm bảo trong `application-test.yaml`:

```yaml
spring:
  sql:
    init:
      mode: always  # Chạy SQL scripts
```

### Lỗi: "No qualifying bean of type"

**Nguyên nhân**: Test class không load đúng Spring context.

**Giải pháp**: Thêm annotation:

```java
@ActiveProfiles("test")
@WebMvcTest(controllers = AuthController.class)
class AuthControllerTest { ... }
```

### Lỗi: MySQL connection trong tests

**Nguyên nhân**: Test đang sử dụng `application.yaml` thay vì `application-test.yaml`.

**Giải pháp**: 
1. Đảm bảo có `@ActiveProfiles("test")` trên test class
2. Kiểm tra file `application-test.yaml` tồn tại trong `src/test/resources/`

### Xem H2 Database trong tests (Debug)

Thêm vào `application-test.yaml`:

```yaml
spring:
  h2:
    console:
      enabled: true
logging:
  level:
    org.hibernate.SQL: DEBUG
```

Sau đó trong test, thêm breakpoint và truy cập: http://localhost:8080/h2-console

## ✨ Best Practices

1. **Luôn dùng H2 cho tests** - Nhanh, không cần setup MySQL
2. **Dùng @ActiveProfiles("test")** - Đảm bảo load đúng config
3. **Mock dependencies** - AuthServiceTest mock UserRepository
4. **Test cả API layer** - AuthControllerTest dùng MockMvc
5. **Cleanup sau test** - H2 tự động xóa với `create-drop`

## 📝 Checklist Setup Testing

- [x] Thêm H2 dependency với scope=test
- [x] Tạo `application-test.yaml`
- [x] Tạo `test-data.sql`
- [x] Thêm `@ActiveProfiles("test")` vào test classes
- [x] Configure Hibernate ddl-auto=create-drop
- [x] Viết test cases
- [x] Run `mvn test` và pass all tests ✅

## 🎉 Kết quả

```bash
mvn test
```

```
[INFO] Tests run: 20, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS ✅
```

**Không cần MySQL running!** 🚀

