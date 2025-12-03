import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import * as authService from '../services/authService';

// Mock the entire authService module
jest.mock('../services/authService');

// Wrapper for Router context
const LoginWithRouter = ({ mockApi, onSuccess }) => (
  <BrowserRouter>
    <LoginPage mockApi={mockApi} onSuccess={onSuccess} />
  </BrowserRouter>
);

/**
 * Frontend Mocking Tests for Login Component
 * 5.1.1 Frontend Mocking (2.5 điểm)
 * 
 * Mock external dependencies cho Login component:
 * a) Mock authService.loginUser() (1 điểm)
 * b) Test với mocked successful/failed responses (1 điểm)
 * c) Verify mock calls (0.5 điểm)
 */

describe('5.1.1 Frontend Mocking Tests - Login Component', () => {
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ==========================================
  // a) Mock authService.loginUser() (1 điểm)
  // ==========================================

  describe('a) Mock authService.loginUser() (1 điểm)', () => {
    
    test('TC1: Mock authService.mockLogin được gọi khi submit form', async () => {
      // Arrange: Setup mock
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        message: 'Login successful',
        token: 'mocked-token-123',
        user: { id: 1, username: 'testuser' }
      });

      // Act: Render with mocked API
      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      // Assert: Verify mock was called
      await waitFor(() => {
        expect(mockLoginFn).toHaveBeenCalled();
      });
    });

    test('TC2: Mock được gọi với đúng parameters (username, password)', async () => {
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        token: 'test-token'
      });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      const testUsername = 'john_doe';
      const testPassword = 'SecurePass123';

      fireEvent.change(usernameInput, { target: { value: testUsername } });
      fireEvent.change(passwordInput, { target: { value: testPassword } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLoginFn).toHaveBeenCalledWith(testUsername, testPassword);
      });
    });

    test('TC3: Mock được gọi đúng 1 lần cho 1 submission', async () => {
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        token: 'test-token'
      });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLoginFn).toHaveBeenCalledTimes(1);
      });
    });

    test('TC4: Mock có thể được spy để track calls', async () => {
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        token: 'spy-token'
      });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      // First call
      fireEvent.change(usernameInput, { target: { value: 'user1' } });
      fireEvent.change(passwordInput, { target: { value: 'Pass123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLoginFn).toHaveBeenCalledWith('user1', 'Pass123');
      });

      // Clear and second call
      fireEvent.change(usernameInput, { target: { value: 'user2' } });
      fireEvent.change(passwordInput, { target: { value: 'Pass456' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLoginFn).toHaveBeenCalledTimes(2);
        expect(mockLoginFn).toHaveBeenLastCalledWith('user2', 'Pass456');
      });
    });

    test('TC5: Mock không được gọi khi validation fails', async () => {
      const mockLoginFn = jest.fn();

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const submitButton = screen.getByTestId('login-button');

      // Submit empty form (should fail validation)
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('username-error')).toBeInTheDocument();
      });

      // Mock should not be called
      expect(mockLoginFn).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // b) Test với mocked successful/failed responses (1 điểm)
  // ==========================================

  describe('b) Test với Mocked Successful/Failed Responses (1 điểm)', () => {
    
    test('TC1: Mock successful response - Hiển thị success message', async () => {
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        message: 'Login successful',
        token: 'success-token-123',
        user: { id: 1, username: 'testuser' }
      });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const message = screen.getByTestId('login-message');
        expect(message).toHaveTextContent('Login successful');
        expect(message).toHaveClass('success');
      });
    });

    test('TC2: Mock successful response - Token được lưu vào localStorage', async () => {
      const expectedToken = 'jwt-token-abc123';
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        token: expectedToken
      });

      // Spy on storeAuthToken from authService
      const storeAuthTokenSpy = jest.spyOn(authService, 'storeAuthToken');

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toBeInTheDocument();
        expect(storeAuthTokenSpy).toHaveBeenCalledWith(expectedToken);
      });

      storeAuthTokenSpy.mockRestore();
    });

    test('TC3: Mock failed response (wrong credentials) - Hiển thị error message', async () => {
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: false,
        message: 'Invalid username or password'
      });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass1' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const message = screen.getByTestId('login-message');
        expect(message).toHaveTextContent('Invalid username or password');
        expect(message).toHaveClass('error');
      });
    });

    test('TC4: Mock rejected promise (network error) - Hiển thị error', async () => {
      const networkError = new Error('Network connection failed');
      networkError.response = {
        status: 500,
        data: { message: 'Network connection failed' }
      };
      const mockLoginFn = jest.fn().mockRejectedValue(networkError);

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const message = screen.getByTestId('login-message');
        expect(message).toHaveTextContent(/network/i);
        expect(message).toHaveClass('error');
      });
    });

    test('TC5: Mock successful response - onSuccess callback được gọi', async () => {
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        token: 'callback-token'
      });
      const mockOnSuccess = jest.fn();

      render(<LoginWithRouter mockApi={mockLoginFn} onSuccess={mockOnSuccess} />);

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

    test('TC6: Mock failed response - onSuccess callback KHÔNG được gọi', async () => {
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: false,
        message: 'Login failed'
      });
      const mockOnSuccess = jest.fn();

      render(<LoginWithRouter mockApi={mockLoginFn} onSuccess={mockOnSuccess} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveClass('error');
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    test('TC7: Mock response với different data structures', async () => {
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        token: 'custom-token',
        user: {
          id: 999,
          username: 'customuser',
          email: 'custom@example.com',
          roles: ['admin', 'user']
        }
      });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'customuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Custom123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveClass('success');
      });
    });

    test('TC8: Mock delayed response - Loading state hiển thị', async () => {
      const mockLoginFn = jest.fn().mockImplementation(() =>
        new Promise(resolve => 
          setTimeout(() => resolve({
            success: true,
            token: 'delayed-token'
          }), 500)
        )
      );

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      // Check loading state
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/signing in/i);

      // Wait for success
      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // c) Verify mock calls (0.5 điểm)
  // ==========================================

  describe('c) Verify Mock Calls (0.5 điểm)', () => {
    
    test('TC1: Verify mock được gọi với exact arguments', async () => {
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        token: 'verify-token'
      });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'exactUser' } });
      fireEvent.change(passwordInput, { target: { value: 'ExactPass123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLoginFn).toHaveBeenCalledWith('exactUser', 'ExactPass123');
        expect(mockLoginFn).toHaveBeenCalledTimes(1);
      });
    });

    test('TC2: Verify mock call order trong multiple submissions', async () => {
      const mockLoginFn = jest.fn()
        .mockResolvedValueOnce({ success: false, message: 'First failed' })
        .mockResolvedValueOnce({ success: true, token: 'second-success' });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      // First submission
      fireEvent.change(usernameInput, { target: { value: 'user1' } });
      fireEvent.change(passwordInput, { target: { value: 'Pass123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveClass('error');
      });

      // Second submission
      fireEvent.change(usernameInput, { target: { value: 'user2' } });
      fireEvent.change(passwordInput, { target: { value: 'Pass456' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveClass('success');
      });

      // Verify call order
      expect(mockLoginFn).toHaveBeenCalledTimes(2);
      expect(mockLoginFn).toHaveBeenNthCalledWith(1, 'user1', 'Pass123');
      expect(mockLoginFn).toHaveBeenNthCalledWith(2, 'user2', 'Pass456');
    });

    test('TC3: Verify mock với toHaveBeenCalledWith matcher', async () => {
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        token: 'matcher-token'
      });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'matchUser' } });
      fireEvent.change(passwordInput, { target: { value: 'MatchPass123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLoginFn).toHaveBeenCalledWith(
          expect.stringContaining('match'),
          expect.any(String)
        );
      });
    });

    test('TC4: Verify mock.calls array chứa tất cả arguments', async () => {
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        token: 'calls-token'
      });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'arrayUser' } });
      fireEvent.change(passwordInput, { target: { value: 'ArrayPass123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLoginFn.mock.calls.length).toBe(1);
        expect(mockLoginFn.mock.calls[0][0]).toBe('arrayUser');
        expect(mockLoginFn.mock.calls[0][1]).toBe('ArrayPass123');
      });
    });

    test('TC5: Verify mock.results chứa return values', async () => {
      const expectedResult = {
        success: true,
        token: 'result-token',
        user: { id: 1, username: 'resultUser' }
      };

      const mockLoginFn = jest.fn().mockResolvedValue(expectedResult);

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'resultUser' } });
      fireEvent.change(passwordInput, { target: { value: 'Result123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toBeInTheDocument();
      });

      // Verify mock results
      expect(mockLoginFn.mock.results.length).toBe(1);
      expect(mockLoginFn.mock.results[0].type).toBe('return');
      await expect(mockLoginFn.mock.results[0].value).resolves.toEqual(expectedResult);
    });

    test('TC6: Verify mockClear() resets call history', async () => {
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        token: 'clear-token'
      });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      // First call
      fireEvent.change(usernameInput, { target: { value: 'user1' } });
      fireEvent.change(passwordInput, { target: { value: 'Pass123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLoginFn).toHaveBeenCalledTimes(1);
      });

      // Clear mock
      mockLoginFn.mockClear();

      // Second call after clear
      fireEvent.change(usernameInput, { target: { value: 'user2' } });
      fireEvent.change(passwordInput, { target: { value: 'Pass456' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLoginFn).toHaveBeenCalledTimes(1); // Reset to 1
      });
    });

    test('TC7: Verify với expect.assertions để ensure async calls', async () => {
      expect.assertions(3);

      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        token: 'assertion-token'
      });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'assertUser' } });
      fireEvent.change(passwordInput, { target: { value: 'Assert123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLoginFn).toHaveBeenCalled();
        expect(mockLoginFn).toHaveBeenCalledWith('assertUser', 'Assert123');
        expect(mockLoginFn).toHaveBeenCalledTimes(1);
      });
    });
  });

  // ==========================================
  // Bonus: Advanced Mocking Scenarios
  // ==========================================

  describe('Bonus: Advanced Mocking Scenarios', () => {
    
    test('Mock với mockImplementation để custom logic', async () => {
      const mockLoginFn = jest.fn().mockImplementation((username, password) => {
        if (username === 'admin' && password === 'Admin123') {
          return Promise.resolve({
            success: true,
            token: 'admin-token',
            user: { id: 1, username: 'admin', role: 'admin' }
          });
        }
        return Promise.resolve({
          success: false,
          message: 'Access denied'
        });
      });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'Admin123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveClass('success');
      });
    });

    test('Mock spyOn authService methods', async () => {
      const spyStoreToken = jest.spyOn(authService, 'storeAuthToken');
      
      const mockLoginFn = jest.fn().mockResolvedValue({
        success: true,
        token: 'spy-token-123'
      });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(spyStoreToken).toHaveBeenCalledWith('spy-token-123');
      });

      spyStoreToken.mockRestore();
    });

    test('Mock với mockResolvedValueOnce chain', async () => {
      const mockLoginFn = jest.fn()
        .mockResolvedValueOnce({ success: false, message: 'Attempt 1 failed' })
        .mockResolvedValueOnce({ success: false, message: 'Attempt 2 failed' })
        .mockResolvedValueOnce({ success: true, token: 'third-attempt-success' });

      render(<LoginWithRouter mockApi={mockLoginFn} />);

      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      // Attempt 1
      fireEvent.change(usernameInput, { target: { value: 'user' } });
      fireEvent.change(passwordInput, { target: { value: 'Pass123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveClass('error');
      });

      // Attempt 2
      fireEvent.change(passwordInput, { target: { value: 'Pass456' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveClass('error');
      });

      // Attempt 3 - Success
      fireEvent.change(passwordInput, { target: { value: 'Pass789' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-message')).toHaveClass('success');
      });

      expect(mockLoginFn).toHaveBeenCalledTimes(3);
    });
  });
});
