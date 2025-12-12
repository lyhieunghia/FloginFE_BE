import http from 'k6/http';
import { check, sleep } from 'k6';

// Cấu hình các kịch bản test (Load & Stress)
export const options = {
  stages: [
    // --- LOAD TEST (Tải bình thường & cao) ---
    { duration: '30s', target: 100 },  // Ramp up lên 100 users trong 30s
    { duration: '1m', target: 100 },   // Giữ 100 users trong 1 phút
    { duration: '30s', target: 500 },  // Ramp up lên 500 users
    { duration: '1m', target: 500 },   // Giữ 500 users
    { duration: '30s', target: 1000 }, // Ramp up lên 1000 users
    { duration: '1m', target: 1000 },  // Giữ 1000 users
    
    // --- STRESS TEST (Tìm điểm gãy - Breaking point) ---
    { duration: '2m', target: 2000 },  // Đẩy lên 2000 users để xem server có sập không
    
    // --- KẾT THÚC ---
    { duration: '30s', target: 0 },    // Giảm dần về 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% request phải phản hồi dưới 500ms
    http_req_failed: ['rate<0.01'],   // Tỉ lệ lỗi phải dưới 1%
  },
};

const BASE_URL = 'https://localhost:8080'; // Đảm bảo Backend đang chạy ở port này

export default function () {
  // Payload dựa trên LoginRequest.java
  const payload = JSON.stringify({
    username: 'admin', // Đảm bảo user này CÓ TỒN TẠI trong DB
    password: 'Admin123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/api/auth/login`, payload, params);

  // Kiểm tra kết quả
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has token': (r) => r.json('token') !== undefined, // Dựa vào AuthController trả về token
  });

  sleep(1); // Mỗi user nghỉ 1s trước khi request tiếp
}