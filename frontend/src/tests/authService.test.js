jest.mock('axios');

import axios from 'axios';
import {
  login,
  mockLogin,
  storeAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated,
} from '../services/authService';

describe('authService', () => {
  const API_BASE = 'http://localhost:8080';
  const endpoint = `${API_BASE}/api/auth/login`;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  // ==============================================
  // Test login function
  // ==============================================
  describe('login', () => {
    test('trả về success khi axios.post thành công với message', async () => {
      const mockResponse = {
        data: {
          message: 'login success',
          token: 'jwt-token-123',
          user: { id: 1, username: 'user123' }
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      const res = await login('user123', 'pass123');

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(endpoint, {
        username: 'user123',
        password: 'pass123'
      });
      expect(res).toEqual({
        success: true,
        message: 'login success',
        token: 'jwt-token-123',
        user: { id: 1, username: 'user123' }
      });
    });

    test('trả về success với message mặc định khi backend không có message', async () => {
      const mockResponse = {
        data: {
          token: 'jwt-token-456',
          user: { id: 2, username: 'user456' }
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      const res = await login('user456', 'pass456');

      expect(res).toEqual({
        success: true,
        message: 'thanh cong',
        token: 'jwt-token-456',
        user: { id: 2, username: 'user456' }
      });
    });

    test('trả về lỗi khi backend trả error.response với message', async () => {
      const axiosError = {
        response: {
          data: { message: 'Invalid credentials' }
        }
      };
      axios.post.mockRejectedValueOnce(axiosError);

      const res = await login('wrongUser', 'wrongPass');

      expect(axios.post).toHaveBeenCalledWith(endpoint, {
        username: 'wrongUser',
        password: 'wrongPass'
      });
      expect(res).toEqual({
        success: false,
        message: 'Invalid credentials'
      });
    });

    test('trả về lỗi với message mặc định khi backend không có message', async () => {
      const axiosError = {
        response: {
          data: {}
        }
      };
      axios.post.mockRejectedValueOnce(axiosError);

      const res = await login('user', 'pass');

      expect(res).toEqual({
        success: false,
        message: 'sai thong tin'
      });
    });

    test('trả về network error khi axios ném lỗi không có response', async () => {
      axios.post.mockRejectedValueOnce(new Error('network fail'));

      const res = await login('anyuser', 'anypass');

      expect(axios.post).toHaveBeenCalledWith(endpoint, {
        username: 'anyuser',
        password: 'anypass'
      });
      expect(res).toEqual({
        success: false,
        message: 'Network error, please try again'
      });
    });
  });

  // ==============================================
  // Test mockLogin function
  // ==============================================
  describe('mockLogin', () => {
    test('trả về success với correct credentials', async () => {
      const res = await mockLogin('testuser', 'Test123');

      expect(res).toEqual({
        success: true,
        message: 'thanh cong',
        token: 'fake-token-123',
        user: {
          id: 1,
          username: 'testuser',
        }
      });
    });

    test('trả về failure với wrong username', async () => {
      const res = await mockLogin('wronguser', 'Test123');

      expect(res).toEqual({
        success: false,
        message: 'sai thong tin'
      });
    });

    test('trả về failure với wrong password', async () => {
      const res = await mockLogin('testuser', 'wrongpass');

      expect(res).toEqual({
        success: false,
        message: 'sai thong tin'
      });
    });

    test('có delay 500ms', async () => {
      const start = Date.now();
      await mockLogin('testuser', 'Test123');
      const duration = Date.now() - start;

      expect(duration).toBeGreaterThanOrEqual(450);
    });
  });

  // ==============================================
  // Test storeAuthToken function
  // ==============================================
  describe('storeAuthToken', () => {
    test('lưu token vào localStorage', () => {
      storeAuthToken('test-token-123');

      expect(localStorage.getItem('auth_token')).toBe('test-token-123');
    });

    test('xử lý lỗi khi localStorage.setItem throw error', () => {
      const mockError = new Error('Storage full');
      jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw mockError;
      });

      storeAuthToken('test-token');

      expect(console.error).toHaveBeenCalledWith('Failed to store token:', mockError);
      
      Storage.prototype.setItem.mockRestore();
    });
  });

  // ==============================================
  // Test getAuthToken function
  // ==============================================
  describe('getAuthToken', () => {
    test('lấy token từ localStorage khi token tồn tại', () => {
      localStorage.setItem('auth_token', 'stored-token-456');

      const token = getAuthToken();

      expect(token).toBe('stored-token-456');
    });

    test('trả về null khi không có token trong localStorage', () => {
      const token = getAuthToken();

      expect(token).toBeNull();
    });

    test('xử lý lỗi và trả về null khi localStorage.getItem throw error', () => {
      const mockError = new Error('Storage access denied');
      jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw mockError;
      });

      const token = getAuthToken();

      expect(token).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Failed to get token:', mockError);
      
      Storage.prototype.getItem.mockRestore();
    });
  });

  // ==============================================
  // Test removeAuthToken function
  // ==============================================
  describe('removeAuthToken', () => {
    test('xóa token khỏi localStorage', () => {
      localStorage.setItem('auth_token', 'token-to-remove');
      expect(localStorage.getItem('auth_token')).toBe('token-to-remove');

      removeAuthToken();

      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    test('xử lý lỗi khi localStorage.removeItem throw error', () => {
      const mockError = new Error('Cannot remove item');
      jest.spyOn(Storage.prototype, 'removeItem').mockImplementationOnce(() => {
        throw mockError;
      });

      removeAuthToken();

      expect(console.error).toHaveBeenCalledWith('Failed to remove token:', mockError);
      
      Storage.prototype.removeItem.mockRestore();
    });
  });

  // ==============================================
  // Test isAuthenticated function
  // ==============================================
  describe('isAuthenticated', () => {
    test('trả về true khi có token trong localStorage', () => {
      localStorage.setItem('auth_token', 'valid-token');

      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    test('trả về false khi không có token trong localStorage', () => {
      const result = isAuthenticated();

      expect(result).toBe(false);
    });

    test('trả về false khi token là empty string', () => {
      localStorage.setItem('auth_token', '');

      const result = isAuthenticated();

      expect(result).toBe(false);
    });

    test('trả về false khi getAuthToken throw error', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const result = isAuthenticated();

      expect(result).toBe(false);
      
      Storage.prototype.getItem.mockRestore();
    });
  });
});