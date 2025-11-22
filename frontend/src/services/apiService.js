import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

/**
 * Login API call using Axios
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, message?: string, token?: string, user?: object}>}
 */
export const loginApi = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username,
      password
    });

    // Axios tự động throw error nếu status >= 400, nên đây là thành công
    const data = response.data;

    return {
      success: true,
      message: data.message || 'thanh cong',
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    // Xử lý lỗi: 401, network, ...
    if (error.response) {
      // Response từ backend (status code != 2xx)
      const data = error.response.data;
      return {
        success: false,
        message: data.message || 'sai thong tin',
      };
    } else {
      // Network error hoặc không có response
      return {
        success: false,
        message: 'Network error, please try again',
      };
    }
  }
};

/**
 * Mock API for testing (không cần backend)
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, message?: string, token?: string, user?: object}>}
 */
export const mockLoginApi = async (username, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (username === 'testuser' && password === 'Test123') {
    return {
      success: true,
      message: 'thanh cong',
      token: 'fake-token-123',
      user: {
        username,
        email: `${username}@example.com`,
      },
    };
  }

  return {
    success: false,
    message: 'sai thong tin',
  };
};
