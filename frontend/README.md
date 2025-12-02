# Demo Đăng Nhập (MOCK API)

Dự án này minh họa giao diện đăng nhập sử dụng MOCK API, không gọi backend thật. Được xây dựng bằng React và Testing Library để kiểm thử tích hợp.

---

## ✅ Tính Năng

- **Form Đăng Nhập**: Bao gồm kiểm tra hợp lệ username/password.
- **MOCK API**: Mô phỏng phản hồi API mà không cần gọi mạng:
  - **Thành công**: Username = `testuser`, Password = `Test123`.
    ```json
    {
      "success": true,
      "message": "thanh cong",
      "token": "fake-token-123"
    }
    ```
  - **Thất bại**: Trả về `{ success: false, message: 'sai thong tin' }`.
- **Checklist UI**: Quan sát trạng thái kiểm thử trực tiếp trên giao diện (❌/✅ thay đổi theo tương tác).
- **Kiểm Thử Tích Hợp**: Viết bằng `@testing-library/react` và `jest-dom`.

---

## 👤 Tài Khoản Test

- **Username**: `testuser`
- **Password**: `Test123`

Nhập đúng thông tin trên sẽ hiển thị thông báo "thanh cong" và bật ✅ trong checklist "success".

---

## 🔧 Yêu Cầu Môi Trường

- **Node.js**: Phiên bản 18+ (khuyến nghị LTS).
- **npm**: Hoặc công cụ thay thế như `pnpm`/`yarn`.

> **Lưu ý**: Nếu Windows báo lỗi về `npm.ps1`, tham khảo mục [Khắc Phục Sự Cố](#-khac-phuc-su-co-windows) bên dưới.

---

## 🚀 Cài Đặt & Chạy

1. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

2. **Chạy server phát triển**:
   - Với **Vite**:
     ```bash
     npm run dev
     ```
   - Với **Create React App (CRA)**:
     ```bash
     npm start
     ```

> Mặc định, các component `App` và `Login` đang ở chế độ MOCK (không gọi API thật). Bạn có thể truyền prop `mockApi` để tùy chỉnh hành vi.

---

## 🗂️ Cấu Trúc Dự Án

```
project-root/
├─ src/
│  ├─ App.jsx
│  ├─ components/
│  │  └─ Login.jsx
│  └─ utils/
│     └─ validation.js
├─ __tests__/
│  └─ Login.integration.test.jsx
├─ package.json
└─ README.md
```

Đảm bảo đường dẫn trong file kiểm thử khớp với vị trí thực tế.

---

## 📜 Scripts Gợi Ý

Thêm các script sau vào `package.json` nếu chưa có:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest --runInBand"
  }
}
```

### Các Phụ Thuộc

- Với **Vite**:
  ```bash
  npm i -D vite @vitejs/plugin-react
  ```
- Với **Jest + Testing Library**:
  ```bash
  npm i -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
  ```

### Cấu Hình Jest

Tạo hoặc cập nhật `jest.config.js`:

```js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['js', 'jsx'],
  transform: { '^.+\\.(js|jsx)$': 'babel-jest' }
};
```

Tạo `jest.setup.js`:

```js
import '@testing-library/jest-dom';
```

---

## 🧪 Chạy Kiểm Thử

Chạy bộ kiểm thử:
```bash
npm test
```

### Phạm Vi Kiểm Thử

Các kiểm thử tích hợp trong `__tests__/Login.integration.test.jsx` bao gồm:

1. **Submit Form Rỗng**: Hiển thị lỗi kiểm tra hợp lệ (không gọi `mockApi`).
2. **Submit Hợp Lệ**: Gọi `mockApi`, nhận "thanh cong", và bật ✅ trong checklist success.
3. **Xử Lý Lỗi**: Hiển thị thông báo lỗi khi `mockApi` thất bại hoặc lỗi mạng.

> Vì ứng dụng sử dụng MOCK API hoàn toàn, không cần gọi API thật hoặc giả lập fetch.

---

## 🔍 Hành Vi MOCK API

Các component `Login` và `App` xử lý gọi MOCK API như sau:

1. Nếu prop `mockApi` được truyền vào, sẽ sử dụng function đó.
2. Nếu không, sẽ sử dụng `builtinMockApi` tích hợp sẵn.

Không có nhánh nào gọi API backend thật trong demo này.

```js
const fn = typeof mockApi === 'function' ? mockApi : builtinMockApi;
const result = await fn(username.trim(), password);
```

---

## ♿ Accessibility & Data-TestID

- **Inputs**: `data-testid="username-input"`, `password-input`, `login-button`, `login-message`.
- **Thông Báo Lỗi**: `username-error`, `password-error`.
- **Checklist**: Văn bản rõ ràng để dễ dàng kiểm tra bằng `getByText`.

---

## 🧰 Khắc Phục Sự Cố (Windows)

### Node/npm Không Nhận Lệnh

1. Cài đặt Node.js LTS từ [trang chủ](https://nodejs.org/).
2. Mở PowerShell mới và kiểm tra:
   ```bash
   node -v
   npm -v
   ```
3. Nếu vẫn lỗi, kiểm tra biến môi trường PATH.

### npm.ps1 Không Thể Chạy

Nếu gặp lỗi:
```
npm.ps1 cannot be loaded because running scripts is disabled
```
Chạy lệnh sau trong PowerShell (với quyền Administrator hoặc Current User):
```bash
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
Khởi động lại terminal và thử lại:
```bash
npm -v
```

---

## 📌 Ghi Chú

Demo này không sử dụng backend. Nếu bạn muốn kết nối với backend thật trong tương lai:

1. Khôi phục nhánh `fetch` trong code.
2. Viết kiểm thử với giả lập fetch hoặc sử dụng MSW để mô phỏng gọi mạng.