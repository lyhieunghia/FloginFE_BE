import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

/**
 * Login API call using Axios
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, message?: string, token?: string, user?: object}>}
 */
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username,
      password
    });

    const data = response.data;

    return {
      success: true,
      message: data.message || 'thanh cong',
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    if (error.response) {
      const data = error.response.data;
      return {
        success: false,
        message: data.message || 'sai thong tin',
      };
    } else {
      return {
        success: false,
        message: 'Network error, please try again',
      };
    }
  }
};

/**
 * Mock login API for testing (no backend required)
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, message?: string, token?: string, user?: object}>}
 */
export const mockLogin = async (username, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (username === 'testuser' && password === 'Test123') {
    return {
      success: true,
      message: 'thanh cong',
      token: 'fake-token-123',
      user: {
        id: 1,
        username: username,
      },
    };
  }

  return {
    success: false,
    message: 'sai thong tin',
  };
};

/**
 * Store authentication token in localStorage
 * @param {string} token 
 */
export const storeAuthToken = (token) => {
  try {
    localStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
};

/**
 * Get authentication token from localStorage
 * @returns {string|null}
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem('auth_token');
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = () => {
  try {
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};
