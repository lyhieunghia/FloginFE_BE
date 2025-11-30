import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8081';

export const options = {
  scenarios: {
    stress_products: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 100 },
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
    http_req_failed: ['rate<0.10'],      // chấp nhận tối đa 10 percent lỗi khi stress
    http_req_duration: ['p(95)<1000'],   // 95 percent request dưới 1s
  },
};

export default function () {
  // 1. Gọi list sản phẩm có phân trang
  const listRes = http.get(`${BASE_URL}/api/products?page=0&size=10`);

  check(listRes, {
    'list status is 200': (r) => r.status === 200,
  });

  // 2. Nếu có data thì gọi thêm detail của 1 sản phẩm
  try {
    const body = listRes.json();
    if (body && Array.isArray(body.content) && body.content.length > 0) {
      const id = body.content[0].id;
      const detailRes = http.get(`${BASE_URL}/api/products/${id}`);

      check(detailRes, {
        'detail status is 200': (r) => r.status === 200,
      });
    }
  } catch (e) {
    // ignore parse error để không làm vỡ test
  }

  sleep(1);
}
