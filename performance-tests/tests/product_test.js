import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Warm up
    { duration: '1m', target: 200 },  // Load test mức trung bình
    { duration: '30s', target: 0 },   // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // Cho phép chậm hơn chút (1s) nếu query DB nặng
  },
};

const BASE_URL = 'https://localhost:8080';

// Hàm setup chạy 1 lần duy nhất đầu tiên để chuẩn bị dữ liệu (Lấy Token)
export function setup() {
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    username: 'admin', 
    password: 'Admin123'
  }), { headers: { 'Content-Type': 'application/json' } });

  const token = loginRes.json('token');
  return { token }; // Trả về token để các VU sử dụng
}

export default function (data) {
  // data ở đây chính là object được return từ hàm setup()
  const params = {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Gửi kèm Token nếu API yêu cầu
      'Content-Type': 'application/json',
    },
  };

  // Test API GET /api/products (Lấy danh sách)
  const res = http.get(`${BASE_URL}/api/products`, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'verify response body': (r) => r.body.length > 0,
  });

  sleep(1);
}