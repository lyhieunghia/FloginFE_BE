// src/__tests__/Login.integration.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';

// Giả định Login có các data-testid:
// 'username-input', 'password-input', 'login-button',
// 'username-error' (hoặc 'password-error'), 'login-message'

describe('Login Component Integration Tests', () => {
  // a) Test rendering & user interactions
  test('Hiển thị lỗi khi submit form rỗng', async () => {
    render(<Login useMockApi={true} />);

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
    render(<Login useMockApi={true} />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('login-message')).toHaveTextContent('dang nhap thanh cong');
    });
  });

  // c) Test error handling (401)
  test('Hiển thị lỗi khi API trả về 401', async () => {
    render(<Login useMockApi={true} />);

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
    render(<Login useMockApi={true} />);

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
