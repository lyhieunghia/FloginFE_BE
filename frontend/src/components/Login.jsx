import React, { useState } from 'react';
import './Login.css';

/**
 * Login Component với integration test support
 * Props:
 * - mockApi?: (username, password) => Promise<{ success: boolean, message?: string, token?: string }>
 * - onSuccess?: (token: string | undefined, payload: any) => void
 */
export default function Login({ mockApi, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const builtinMockApi = async (u, p) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (u === 'testuser' && p === 'Test123') {
      return {
        success: true,
        message: 'thanh cong',
        token: 'fake-token-123',
        user: { username: u, email: `${u}@example.com` }
      };
    }
    return { success: false, message: 'sai thong tin' };
  };

  const validate = () => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');

    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (username.trim().length < 3) {
      setUsernameError('Username must be at least 3 characters');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginMessage('');
    setIsSuccess(false);

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const fn = typeof mockApi === 'function' ? mockApi : builtinMockApi;
      const result = await fn(username.trim(), password);

      if (result.success) {
        setLoginMessage(result.message || 'thanh cong');
        setIsSuccess(true);

        if (result.token) {
          try {
            localStorage.setItem('auth_token', result.token);
          } catch (error) {
            console.error('Failed to store token:', error);
          }
        }

        if (typeof onSuccess === 'function') {
          onSuccess(result.token, result);
        }
      } else {
        setLoginMessage(result.message || 'Đăng nhập thất bại');
        setIsSuccess(false);
      }
    } catch (err) {
      setLoginMessage('Network error, please try again');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
            </svg>
          </div>
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="login-form">
          <div className="form-group">
            <label htmlFor="username-input" className="form-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Username
            </label>
            <input
              id="username-input"
              data-testid="username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              aria-invalid={!!usernameError}
              aria-describedby={usernameError ? 'username-error' : undefined}
              autoComplete="username"
              className={`form-input ${usernameError ? 'input-error' : ''}`}
            />
            {usernameError && (
              <span id="username-error" data-testid="username-error" className="error-message" role="alert">
                {usernameError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password-input" className="form-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Password
            </label>
            <input
              id="password-input"
              data-testid="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? 'password-error' : undefined}
              autoComplete="current-password"
              className={`form-input ${passwordError ? 'input-error' : ''}`}
            />
            {passwordError && (
              <span id="password-error" data-testid="password-error" className="error-message" role="alert">
                {passwordError}
              </span>
            )}
          </div>

          <button
            type="submit"
            data-testid="login-button"
            disabled={loading}
            aria-busy={loading}
            className={`login-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>

          {loginMessage && (
            <div
              data-testid="login-message"
              role="status"
              className={`login-message ${isSuccess ? 'success' : 'error'}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isSuccess ? (
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />
                ) : (
                  <circle cx="12" cy="12" r="10" />
                )}
              </svg>
              {loginMessage}
            </div>
          )}
        </form>

        <div className="login-footer">
          <p className="demo-info">
            <strong>Demo Account:</strong> testuser / Test123
          </p>
        </div>
      </div>
    </div>
  );
}
