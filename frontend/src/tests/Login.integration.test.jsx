// src/__tests__/Login.integration.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { server, rest } from '../setupTests';
import Login from '../Login'; // sửa path theo project của bạn

// Giả định Login có các data-testid:
// 'username-input', 'password-input', 'login-button',
// 'username-error' (hoặc 'password-error'), 'login-message'

describe('Login Component Integration Tests', () => {
  // a) Test rendering & user interactions
  test('Hiển thị lỗi khi submit form rỗng', async () => {
    render(<Login />);

    const submitButton = screen.getByTestId('login-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Kiểm tra thông điệp lỗi xuất hiện
      expect(screen.getByTestId('username-error')).toBeInTheDocument();
      // Nếu có password-error thì kiểm luôn:
      // expect(screen.getByTestId('password-error')).toBeInTheDocument();
    });
  });

  // b) Test submit hợp lệ & gọi API (success 200)
  test('Gọi API khi submit form hợp lệ và hiển thị success message', async () => {
    // MSW handler: trả về success
    server.use(
      rest.post('/api/auth/login', async (req, res, ctx) => {
        const body = await req.json();
        // Kiểm request body đúng
        if (body.username === 'testuser' && body.password === 'Test123') {
          return res(
            ctx.status(200),
            ctx.json({
              success: true,
              token: 'fake-jwt-token-123',
              message: 'thanh cong',
            }),
            ctx.set('X-Auth-Token', 'fake-jwt-token-123')
          );
        }
        return res(
          ctx.status(401),
          ctx.json({ success: false, message: 'sai thong tin' })
        );
      })
    );

    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('login-message')).toHaveTextContent('thanh cong');
    });
  });

  // c) Test error handling (401)
  test('Hiển thị lỗi khi API trả về 401', async () => {
    server.use(
      rest.post('/api/auth/login', async (_req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ success: false, message: 'sai thong tin' })
        );
      })
    );

    render(<Login />);

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'wrong' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(screen.getByTestId('login-message')).toHaveTextContent('sai thong tin');
    });
  });

  // c) Test network error (fetch/axios throw)
  test('Hiển thị lỗi khi mạng lỗi (Network error)', async () => {
    server.use(
      rest.post('/api/auth/login', (_req, res, ctx) => {
        return res.networkError('Failed to connect');
      })
    );

    render(<Login />);

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'any' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'any' },
    });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      // Tuỳ thông điệp lỗi trong component
      expect(screen.getByTestId('login-message')).toHaveTextContent(/network|kết nối/i);
    });
  });
});
