
## 5. How to run the performance tests

Make sure the backend is already running at `http://localhost:8081` before running k6.

Go to the project root where the test scripts are located:

```powershell
cd E:\Backend\FloginFE_BE
````

### 5.1 Load test 100 concurrent users

```powershell
$env:VUS = 100
$env:DURATION = '1m'
k6 run login-test.js
```

### 5.2 Load test 500 concurrent users

```powershell
$env:VUS = 500
$env:DURATION = '1m'
k6 run login-test.js
```

### 5.3 Load test 1000 concurrent users

```powershell
$env:VUS = 1000
$env:DURATION = '1m'
k6 run login-test.js
```

### 5.4 Stress test from 1 to 3000 users (Login API)

```powershell
k6 run login-stress.js
```

### 5.5 Stress test from 1 to 3000 users (Product API)

```powershell
k6 run product-stress.js
```

### 5.6 Breaking Point Test (tăng request/s đến khi fail)

```powershell
k6 run breaking-point-test.js
```

**Lưu ý về Breaking Point Test:**
- Test này sử dụng `ramping-arrival-rate` thay vì `ramping-vus`
- Tăng dần từ 50 req/s lên 2000 req/s
- Hệ thống sẽ tự động tăng VUs để đạt target req/s
- Breaking point là mức tải mà:
  - Error rate > 10%
  - P95 response time > 1000ms
  - P99 response time > 2000ms
  - Hoặc server crash/timeout
