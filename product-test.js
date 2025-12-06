import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8081';

export const options = {
  vus: Number(__ENV.VUS || 10),
  duration: __ENV.DURATION || '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'],       // dưới 5 percent lỗi
    http_req_duration: ['p(95)<500'],     // 95 percent request dưới 500 ms
  },
};

export default function () {
  // 1. Gọi API danh sách sản phẩm có phân trang
  const listRes = http.get(`${BASE_URL}/api/products?page=0&size=10`);

  check(listRes, {
    'list status is 200': (r) => r.status === 200,
  });

  // 2. Lấy 1 product id từ kết quả list, nếu có
  let products = [];
  try {
    const body = listRes.json();
    // Spring Data Page có dạng { content: [...], totalElements, ... }
    if (body && Array.isArray(body.content)) {
      products = body.content;
    }
  } catch (e) {
    // ignore parse error để test không bị vỡ
  }

  if (products.length > 0) {
    const id = products[0].id;

    const detailRes = http.get(`${BASE_URL}/api/products/${id}`);

    check(detailRes, {
      'detail status is 200': (r) => r.status === 200,
    });
  }

  sleep(1);
}
