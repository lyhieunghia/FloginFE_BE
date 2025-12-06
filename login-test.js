import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: Number(__ENV.VUS || 10),          // sẽ override bằng env khi chạy
  duration: __ENV.DURATION || '30s',     // sẽ override bằng env khi chạy
  thresholds: {
    http_req_failed: ['rate<0.05'],      // dưới 5 percent lỗi
    http_req_duration: ['p(95)<500'],    // 95 percent request dưới 500ms
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
