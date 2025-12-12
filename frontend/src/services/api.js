import axios from "axios";

const API_BASE_URL = "https://localhost:8080/api";

/**
 * Axios instance with automatic CSRF token handling
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true, // Required for HttpOnly cookies
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
    let csrfToken = match ? decodeURIComponent(match[2]) : null;
    if (csrfToken && ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      
      try {
        localStorage.removeItem('auth_token');
      } catch (e) {
        console.error('Failed to clear auth token:', e);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;