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

Chạy Test

Dự án này sử dụng Jest và React Testing Library để kiểm thử.

Chạy Unit Test (Watch Mode)
Để chạy test ở chế độ theo dõi (watch mode), tự động chạy lại khi có thay đổi file:

```Bash
npm test
```

Chạy Báo cáo Coverage (Yêu cầu 3.2.1c)
Để chạy tất cả các unit test một lần duy nhất và tạo báo cáo độ bao phủ (coverage) :

```Bash
npm run test:coverage
```

Báo cáo chi tiết sẽ được tạo trong thư mục frontend/coverage/lcov-report/index.html