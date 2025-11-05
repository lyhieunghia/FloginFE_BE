# Frontend - Ứng dụng Flogin

Đây là ứng dụng React cho dự án Flogin, bao gồm các chức năng Đăng nhập và Quản lý Sản phẩm.

## Cài đặt

1.  Đảm bảo bạn đã cài đặt [Node.js](https://nodejs.org/) (phiên bản 18+ như yêu cầu trong `README.md` gốc ).
2.  Từ thư mục `frontend`, chạy lệnh sau để cài đặt các thư viện cần thiết:
    ```bash
    npm install
    ```

## Chạy Ứng dụng

```bash
npm start
```

Ứng dụng sẽ mở tại http://localhost:3000.

Chạy Test
Dự án này sử dụng Jest và React Testing Library để kiểm thử.

1. Chạy Test (Chế độ theo dõi)
Để chạy test ở chế độ theo dõi (watch mode), tự động chạy lại khi có thay đổi file (thường dùng khi đang code test):

```Bash
npm test
```

2. Chạy Toàn bộ Test & Báo cáo Coverage (Req 3.2.1 & 4.2.1)
Để chạy toàn bộ các bài test một lần duy nhất và tạo báo cáo độ bao phủ (coverage):

```Bash

npm run test:coverage
```

Lệnh này sẽ thực thi tất cả các kịch bản kiểm thử, bao gồm:

Yêu cầu 3.2.1 (Unit Tests): Kiểm tra các logic riêng lẻ (như productValidation.test.js) và component (như ProductForm.test.js).

Yêu cầu 4.2.1 (Integration Tests): Kiểm tra sự tích hợp của các component trong App.integration.test.js (bao gồm cả "happy path" và "sad path" xử lý lỗi).

Báo cáo chi tiết sẽ được tạo trong thư mục: frontend/coverage/lcov-report/index.html