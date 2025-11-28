import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,            // số user ảo
  duration: '30s',    // chạy 30 giây
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
