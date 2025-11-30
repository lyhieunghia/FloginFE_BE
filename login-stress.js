import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    stress_login: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 100 },   // warm up
        { duration: '1m', target: 300 },
        { duration: '1m', target: 500 },
        { duration: '1m', target: 800 },
        { duration: '1m', target: 1000 },
        { duration: '1m', target: 1200 },
        { duration: '1m', target: 1500 },  // Tăng thêm để tìm breaking point
        { duration: '1m', target: 2000 },  // Tăng thêm để tìm breaking point
        { duration: '1m', target: 2500 },  // Tăng thêm để tìm breaking point
        { duration: '1m', target: 3000 },  // Tăng thêm để tìm breaking point
        { duration: '2m', target: 3000 },  // Hold at peak để quan sát
        { duration: '1m', target: 0 },     // Ramp down
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.10'],        // stress nên cho phép tới 10 percent
    http_req_duration: ['p(95)<1000'],     // p95 dưới 1s là chấp nhận được
  },
};

export default function () {
  const url = 'http://localhost:8081/api/auth/login';

  const payload = JSON.stringify({
    username: 'testuser',
    password: 'Test123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
