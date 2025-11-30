import http from 'k6/http';
import { check, sleep } from 'k6';

// Breaking Point Test - Tăng tải đến khi hệ thống fail
export const options = {
  scenarios: {
    breaking_point: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 500,
      maxVUs: 5000,
      stages: [
        { duration: '2m', target: 50 },    // 50 req/s
        { duration: '2m', target: 100 },   // 100 req/s
        { duration: '2m', target: 200 },   // 200 req/s
        { duration: '2m', target: 400 },   // 400 req/s
        { duration: '2m', target: 800 },   // 800 req/s
        { duration: '2m', target: 1600 },  // 1600 req/s
        { duration: '2m', target: 2000 },  // 2000 req/s
        { duration: '3m', target: 2000 },  // Hold để xem có fail không
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.10'],
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_reqs: ['rate>0'],  // Đảm bảo vẫn xử lý được request
  },
};

export default function () {
  const testType = Math.random() < 0.5 ? 'login' : 'products';
  
  if (testType === 'login') {
    // Test Login API
    const loginUrl = 'http://localhost:8081/api/auth/login';
    const loginPayload = JSON.stringify({
      username: 'testuser',
      password: 'Test123',
    });
    
    const loginParams = {
      headers: { 'Content-Type': 'application/json' },
    };
    
    const loginRes = http.post(loginUrl, loginPayload, loginParams);
    
    check(loginRes, {
      'login status is 200': (r) => r.status === 200,
      'login has token': (r) => r.json('token') !== undefined,
    });
  } else {
    // Test Product API
    const productsUrl = 'http://localhost:8081/api/products?page=0&size=10';
    const productsRes = http.get(productsUrl);
    
    check(productsRes, {
      'products status is 200': (r) => r.status === 200,
      'products has data': (r) => r.json('content') !== undefined,
    });
  }
  
  sleep(0.1);  // Ngắn hơn để tăng tải
}
