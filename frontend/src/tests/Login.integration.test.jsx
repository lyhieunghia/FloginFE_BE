import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { mockLogin } from '../services/authService';

// Wrapper component that includes state management for testing
const LoginWithState = ({ mockApi, onSuccess }) => {
  return (
    <BrowserRouter>
      <LoginPage mockApi={mockApi} onSuccess={onSuccess} />
    </BrowserRouter>
  );
};

// Create alias for backward compatibility with tests
const Login = LoginWithState;

/**
 * Integration Tests for Login Component
 * Câu 3.1: Login - Integration Testing (5 điểm)
 * 
 * Test tích hợp Login component với API service:
 * a) Test rendering và user interactions (2 điểm)
 * b) Test form submission và API calls (2 điểm)
 * c) Test error handling và success messages (1 điểm)
 */

describe('Login Component Integration Tests', () => {
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    jest.clearAllMocks();
  });

  // ==========================================
  // (a) Test rendering và user interactions (2 điểm)
  // ==========================================
  
  describe('a) Rendering và User Interactions (2 điểm)', () => {
    
    test('TC1: Hiển thị form đăng nhập với đầy đủ các trường', () => {
      render(<Login />);

      // Kiểm tra các elements render đúng
      expect(screen.getByTestId('username-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
      
      // Kiểm tra labels
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      
      // Kiểm tra button text
      expect(screen.getByTestId('login-button')).toHaveTextContent(/sign in/i);
    });

    test('TC2: Username input có thể nhận và hiển thị giá trị', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      
      await userEvent.type(usernameInput, 'testuser');
      
      expect(usernameInput).toHaveValue('testuser');
    });

    test('TC3: Password input có thể nhận và hiển thị giá trị (masked)', async () => {
      render(<Login />);

      const passwordInput = screen.getByTestId('password-input');
      
      await userEvent.type(passwordInput, 'Test123');
      
      expect(passwordInput).toHaveValue('Test123');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('TC4: User có thể nhập cả username và password', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');

      await userEvent.type(usernameInput, 'john_doe');
      await userEvent.type(passwordInput, 'SecurePass123');

      expect(usernameInput).toHaveValue('john_doe');
      expect(passwordInput).toHaveValue('SecurePass123');
    });

    test('TC5: Input fields có placeholders đúng', () => {
      render(<Login />);

      expect(screen.getByTestId('username-input')).toHaveAttribute(
        'placeholder',
        'Enter your username'
      );
      expect(screen.getByTestId('password-input')).toHaveAttribute(
        'placeholder',
        'Enter your password'
      );
    });

    test('TC6: Button enabled khi không loading', () => {
      render(<Login />);
      
      const submitButton = screen.getByTestId('login-button');
      expect(submitButton).not.toBeDisabled();
    });

    test('TC7: Hiển thị lỗi validation khi submit form rỗng', async () => {
      render(<Login />);

      const submitButton = screen.getByTestId('login-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toBeInTheDocument();
        expect(screen.getByTestId('username-error')).toHaveTextContent(/không được để trống/i);
      });
    });

    test('TC8: Hiển thị lỗi validation cho username quá ngắn', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'ab' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toBeInTheDocument();
        expect(screen.getByTestId('username-error')).toHaveTextContent(/ít nhất 3 ký tự/i);
      });
    });

    test('TC9: Hiển thị lỗi validation cho password quá ngắn', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'validuser' } });
      fireEvent.change(passwordInput, { target: { value: '12345' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('password-error')).toBeInTheDocument();
        expect(screen.getByTestId('password-error')).toHaveTextContent(/ít nhất 6 ký tự/i);
      });
    });

    test('TC10: Hiển thị lỗi cho username với ký tự không hợp lệ', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'user@name' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toBeInTheDocument();
      });
    });

    test('TC11: Hiển thị lỗi khi password thiếu chữ cái', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('password-error')).toHaveTextContent(/chữ cái/i);
      });
    });

    test('TC12: Clear validation errors khi user sửa input', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const submitButton = screen.getByTestId('login-button');

      // Trigger validation error
      fireEvent.change(usernameInput, { target: { value: 'ab' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toBeInTheDocument();
      });

      // Fix the input - error should clear on next submit
      fireEvent.change(usernameInput, { target: { value: 'validuser' } });
      fireEvent.click(submitButton);

      // Username error should not be about length anymore
      await waitFor(() => {
        const usernameError = screen.queryByTestId('username-error');
        if (usernameError) {
          expect(usernameError).not.toHaveTextContent(/ít nhất 3 ký tự/i);
        }
      });
    });
  });

  // ==========================================
  // (b) Test form submission và API calls (2 điểm)
  // ==========================================

  describe('b) Form Submission và API Calls (2 điểm)', () => {
    
    test('TC1: Gọi API khi submit form hợp lệ', async () => {
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

    test('TC2: Hiển thị loading state khi đang submit', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      // Kiểm tra button disabled và có loading text
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/signing in/i);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toBeInTheDocument();
      });
      
      // After loading, button should be enabled again
      expect(submitButton).not.toBeDisabled();
    });

    test('TC3: Gọi onSuccess callback khi đăng nhập thành công', async () => {
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

    test('TC4: Lưu token vào localStorage khi đăng nhập thành công', async () => {
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
        expect(localStorage.getItem('auth_token')).toBe('fake-token-123');
      });
    });

    test('TC5: Sử dụng custom mockApi prop khi được cung cấp', async () => {
      const customMockApi = jest.fn().mockResolvedValue({
        success: true,
        message: 'custom success',
        token: 'custom-token-xyz',
        user: { id: 99, username: 'customuser' }
      });

      render(<Login mockApi={customMockApi} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'customuser' } });
      fireEvent.change(passwordInput, { target: { value: 'CustomPass123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(customMockApi).toHaveBeenCalledWith('customuser', 'CustomPass123');
        expect(screen.getByTestId('login-message')).toBeInTheDocument();
      });
    });

    test('TC6: Không gọi API khi validation thất bại', async () => {
      const mockApi = jest.fn();
      render(<Login mockApi={mockApi} />);

      const submitButton = screen.getByTestId('login-button');

      // Submit with empty form
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toBeInTheDocument();
      });

      // API should not be called
      expect(mockApi).not.toHaveBeenCalled();
    });

    test('TC7: Gọi API với đúng credentials', async () => {
      const mockApi = jest.fn().mockResolvedValue({
        success: true,
        message: 'Login successful',
        token: 'test-token'
      });

      render(<Login mockApi={mockApi} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      const testUsername = 'john_doe123';
      const testPassword = 'SecurePass123';

      fireEvent.change(usernameInput, { target: { value: testUsername } });
      fireEvent.change(passwordInput, { target: { value: testPassword } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledWith(testUsername, testPassword);
        expect(mockApi).toHaveBeenCalledTimes(1);
      });
    });

    test('TC8: Không submit lại khi đang loading', async () => {
      const mockApi = jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          success: true,
          token: 'test-token'
        }), 1000))
      );

      render(<Login mockApi={mockApi} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      
      // First submit
      fireEvent.click(submitButton);
      
      // Try to submit again while loading
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledTimes(1);
      });
    });

    test('TC9: Token được lưu đúng format vào localStorage', async () => {
      localStorage.clear();

      const expectedToken = 'jwt-token-12345-abcde';
      const mockApi = jest.fn().mockResolvedValue({
        success: true,
        message: 'Success',
        token: expectedToken
      });

      render(<Login mockApi={mockApi} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const storedToken = localStorage.getItem('auth_token');
        expect(storedToken).toBe(expectedToken);
      });
    });

    test('TC10: Submit form bằng Enter key', async () => {
      const mockOnSuccess = jest.fn();
      render(<Login onSuccess={mockOnSuccess} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      
      // Press Enter on password field
      fireEvent.submit(passwordInput.closest('form'));

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  // ==========================================
  // (c) Test error handling và success messages (1 điểm)
  // ==========================================

  describe('c) Error Handling và Success Messages (1 điểm)', () => {
    
    test('TC1: Hiển thị success message khi đăng nhập thành công', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const message = screen.getByTestId('login-message');
        expect(message).toHaveTextContent('thanh cong');
        expect(message).toHaveClass('success');
      });
    });

    test('TC2: Hiển thị error message khi sai thông tin đăng nhập', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const message = screen.getByTestId('login-message');
        expect(message).toHaveTextContent('sai thong tin');
        expect(message).toHaveClass('error');
      });
    });

    test('TC3: Hiển thị network error khi API call thất bại', async () => {
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

    test('TC4: Clear previous messages khi submit form mới', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      // Submit lần 1 với sai thông tin
      fireEvent.change(usernameInput, { target: { value: 'wrong' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveTextContent('sai thong tin');
      });

      // Submit lần 2 với đúng thông tin
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const message = screen.getByTestId('login-message');
        expect(message).toHaveTextContent('thanh cong');
        expect(message).toHaveClass('success');
      });
    });

    test('TC5: Success message có class CSS đúng', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const message = screen.getByTestId('login-message');
        expect(message).toHaveClass('login-message');
        expect(message).toHaveClass('success');
        expect(message).not.toHaveClass('error');
      });
    });

    test('TC6: Error message có class CSS đúng', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass1' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const message = screen.getByTestId('login-message');
        expect(message).toHaveClass('login-message');
        expect(message).toHaveClass('error');
        expect(message).not.toHaveClass('success');
      });
    });

    test('TC7: Hiển thị error khi API trả về success=false', async () => {
      const mockApi = jest.fn().mockResolvedValue({
        success: false,
        message: 'Invalid credentials'
      });

      render(<Login mockApi={mockApi} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const message = screen.getByTestId('login-message');
        expect(message).toHaveClass('error');
      });
    });

    test('TC8: Loading indicator biến mất sau khi có error', async () => {
      const mockApi = jest.fn().mockRejectedValue(new Error('Server error'));

      render(<Login mockApi={mockApi} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      // Should be disabled during loading
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        // After error, button should be enabled again
        expect(submitButton).not.toBeDisabled();
      });
    });

    test('TC9: Validation errors cleared khi submit thành công', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      // First submit with invalid data
      fireEvent.change(usernameInput, { target: { value: 'ab' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toBeInTheDocument();
      });

      // Now submit with valid data
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByTestId('username-error')).not.toBeInTheDocument();
        expect(screen.queryByTestId('password-error')).not.toBeInTheDocument();
      });
    });

    test('TC10: Multiple failed attempts không làm crash component', async () => {
      render(<Login />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      // Attempt 1
      fireEvent.change(usernameInput, { target: { value: 'wrong1' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveClass('error');
      });

      // Attempt 2
      fireEvent.change(usernameInput, { target: { value: 'wrong2' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong456' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveClass('error');
      });

      // Attempt 3 - should still work
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveClass('success');
      });
    });
  });
});
