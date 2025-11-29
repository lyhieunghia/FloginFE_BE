
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

### 5.4 Stress test from 1 to 1200 users

```powershell
k6 run login-stress.js
```
