// frontend/src/tests/Login.integration.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login.jsx';

describe('Login Component Integration Tests', () => {
  // Dọn mocks giữa các test
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test('Hiển thị lỗi khi submit form rỗng', async () => {
    // Arrange
    render(<Login />);

    // Act: click Đăng nhập khi chưa nhập gì
    fireEvent.click(screen.getByTestId('login-button'));

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('username-error')).toBeInTheDocument();
      expect(screen.getByTestId('password-error')).toBeInTheDocument();
    });
  });

  test('Gọi API khi submit form hợp lệ và hiển thị thông báo thành công', async () => {
    // Arrange: mock fetch trả về success 200 + body success
    const fakeBody = { success: true, message: 'Đăng nhập thành công' };
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => fakeBody,
      headers: { get: (k) => (k === 'X-Auth-Token' ? 'token-xyz' : null) },
    });

    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    // Act: nhập dữ liệu hợp lệ và submit
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });
    fireEvent.click(submitButton);

    // Assert: hiển thị thông điệp thành công
    await waitFor(() => {
      expect(screen.getByTestId('login-message')).toHaveTextContent(/thành công/i);
    });

    // Kiểm tra fetch gọi đúng URL & payload
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOpts] = fetchSpy.mock.calls[0];
    expect(calledUrl).toMatch(/\/api\/auth\/login$/);
    expect(calledOpts.method).toBe('POST');
    expect(calledOpts.headers['Content-Type'] || calledOpts.headers['content-type'])
      .toMatch(/application\/json/);
    expect(calledOpts.body).toBe(JSON.stringify({ username: 'testuser', password: 'Test123' }));
  });

  test('Hiển thị thông báo lỗi khi đăng nhập thất bại (401)', async () => {
    // Arrange: mock fetch trả về 401 + message lỗi
    const errorBody = { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' };
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => errorBody,
      headers: { get: () => null },
    });

    render(<Login />);

    // Act: nhập sai thông tin và submit
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByTestId('login-button'));

    // Assert: hiển thị thông điệp lỗi từ server
    await waitFor(() => {
      expect(screen.getByTestId('login-message'))
        .toHaveTextContent(/sai tên đăng nhập hoặc mật khẩu/i);
    });
  });

  test('Hiển thị lỗi mạng khi fetch ném exception', async () => {
    // Arrange: mock fetch ném lỗi (mất mạng, CORS, v.v.)
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    render(<Login />);

    // Act
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
    fireEvent.click(screen.getByTestId('login-button'));

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('login-message')).toHaveTextContent(/network/i);
    });
  });
});
