/**
 * API Service for handling authentication
 * This file provides a clean interface for API calls
 */

// Sử dụng relative path - React proxy sẽ tự động forward đến backend
const API_BASE_URL = '';

/**
 * Login API call
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, message?: string, token?: string, user?: object}>}
 */
export const loginApi = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'thanh cong',
        token: data.token,
        user: data.user,
      };
    } else {
      return {
        success: false,
        message: data.message || 'sai thong tin',
      };
    }
  } catch (error) {
    throw new Error('Network error, please try again');
  }
};

/**
 * Mock API for testing (không cần backend)
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, message?: string, token?: string, user?: object}>}
 */
export const mockLoginApi = async (username, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  if (username === 'testuser' && password === 'Test123') {
    return {
      success: true,
      message: 'thanh cong',
      token: 'fake-token-123',
      user: {
        username: username,
        email: `${username}@example.com`,
      },
    };
  }

  return {
    success: false,
    message: 'sai thong tin',
  };
};

