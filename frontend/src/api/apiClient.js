const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:8080';

function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
export async function apiFetch(url, options = {}) {
  const csrfToken = getCsrfToken();
  
  const config = {
    credentials: 'include', // Gửi HttpOnly cookie
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
      ...(options.headers || {}),
    },
    ...options,
  };

  // Serialize body if it's an object
  if (options.body && typeof options.body !== 'string') {
    config.body = JSON.stringify(options.body);
  }

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const res = await fetch(fullUrl, config);

  // Handle HTTP errors
  if (!res.ok) {
    let errorMessage = 'Request failed';

    try {
      const data = await res.json();
      // XSS-safe: không render HTML từ server
      errorMessage = data.message || data.error || errorMessage;
    } catch {
      errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    }

    // Dispatch auth event cho 401/403
    if (res.status === 401 || res.status === 403) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    const error = new Error(errorMessage);
    error.status = res.status;
    throw error;
  }

  // Parse JSON response
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Helper methods
 */
export const apiClient = {
  get: (url, options) => apiFetch(url, { ...options, method: 'GET' }),
  post: (url, body, options) => apiFetch(url, { ...options, method: 'POST', body }),
  put: (url, body, options) => apiFetch(url, { ...options, method: 'PUT', body }),
  delete: (url, options) => apiFetch(url, { ...options, method: 'DELETE' }),
  patch: (url, body, options) => apiFetch(url, { ...options, method: 'PATCH', body }),
};
