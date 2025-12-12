import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../auth/AuthProvider';

// Mock the apiFetch function
jest.mock('../api/apiClient', () => ({
  apiFetch: jest.fn(),
}));

// Wrapper component that includes AuthProvider for testing
const LoginWithState = ({ mockApi, onSuccess }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoginPage mockApi={mockApi} onSuccess={onSuccess} />
      </AuthProvider>
    </BrowserRouter>
  );
};

// Create alias for backward compatibility with tests
const Login = LoginWithState;

/**
 * Integration Tests for Login Component
 * Câu 3.1: Login - Integration Testing (10 điểm)
 * 4.1.1 Frontend Component Integration (5 điểm)
 */

describe('Login Component Integration Tests', () => {
  
  // ==========================================
  // (a) Test rendering và user interactions (2 điểm)
  // ==========================================
  
  test('Hiển thị lỗi khi submit form rỗng', async () => {
    render(<Login />);

    const submitButton = screen.getByTestId('login-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('username-error')).toBeInTheDocument();
    });
  });

  test('Hiển thị form đăng nhập với đầy đủ các trường', () => {
    render(<Login />);

    // Kiểm tra các elements render đúngnpm
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  test('User có thể nhập username và password', () => {
    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('Test123');
  });

  test('Hiển thị lỗi validation cho username ngắn', async () => {
    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('username-error')).toBeInTheDocument();
    });
  });

  test('Hiển thị lỗi validation cho password ngắn', async () => {
    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('password-error')).toBeInTheDocument();
    });
  });

  // ==========================================
  // (b) Test form submission và API calls (2 điểm)
  // ==========================================

  test('Gọi API khi submit form hợp lệ', async () => {
    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('login-message')).toHaveTextContent('Đăng nhập thành công');
    });
  });

  test('Hiển thị loading state khi đang submit', async () => {
    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });
    fireEvent.click(submitButton);

    // Kiểm tra button disabled trong khi loading
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByTestId('login-message')).toBeInTheDocument();
    });
  });

  test('Gọi onSuccess callback khi đăng nhập thành công', async () => {
    const mockOnSuccess = jest.fn();
    render(<Login onSuccess={mockOnSuccess} />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  test('Lưu token vào localStorage khi đăng nhập thành công', async () => {
    // Clear localStorage trước test
    localStorage.clear();

    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem('auth_token')).toBeTruthy();
    });
  });

  // ==========================================
  // (c) Test error handling và success messages (1 điểm)
  // ==========================================

  test('Hiển thị success message khi đăng nhập thành công', async () => {
    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const message = screen.getByTestId('login-message');
      expect(message).toHaveTextContent('Đăng nhập thành công');
      expect(message).toHaveClass('success');
    });
  });

  test('Hiển thị error message khi sai thông tin đăng nhập', async () => {
    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const message = screen.getByTestId('login-message');
      expect(message).toHaveTextContent('Đăng nhập thất bại');
      expect(message).toHaveClass('error');
    });
  });

  test('Hiển thị network error khi API call thất bại', async () => {
    const mockApiWithError = jest.fn().mockRejectedValue(new Error('Network error'));

    render(<Login mockApi={mockApiWithError} />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const message = screen.getByTestId('login-message');
      expect(message).toHaveTextContent(/network error/i);
      expect(message).toHaveClass('error');
    });
  });

  test('Clear error messages khi submit form mới', async () => {
    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    // Submit lần 1 với sai thông tin
    fireEvent.change(usernameInput, { target: { value: 'wrong' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('login-message')).toHaveTextContent('Đăng nhập thất bại');
    });

    // Submit lần 2 với đúng thông tin
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const message = screen.getByTestId('login-message');
      expect(message).toHaveTextContent('Đăng nhập thành công');
      expect(message).toHaveClass('success');
    });
  });

  // ==========================================
  // Additional Tests for Custom Mock API
  // ==========================================

  test('Sử dụng custom mockApi prop khi được cung cấp', async () => {
    const customMockApi = jest.fn().mockResolvedValue({
      success: true,
      message: 'custom success',
      token: 'custom-token',
    });

    render(<Login mockApi={customMockApi} />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(customMockApi).toHaveBeenCalledWith('testuser', 'Test123');
      expect(screen.getByTestId('login-message')).toHaveTextContent('Đăng nhập thành công');
    });
  });
});
