<<<<<<< Updated upstream
// src/components/Login.jsx
import React, { useState } from 'react';

/**
 * Props:
 * - mockApi?: (username, password) => Promise<{ success: boolean, message?: string, token?: string }>
 * - onSuccess?: (token: string | undefined, payload: any) => void
 * - debugLog?: boolean
 *
 * Deprecated/ignored (để không vỡ code cũ):
 * - baseUrl, useMockApi
 */
export default function Login({
  mockApi,
  onSuccess,
  debugLog = true,
  // deprecated (ignored)
  baseUrl,     // eslint-disable-line no-unused-vars
  useMockApi,  // eslint-disable-line no-unused-vars
}) {
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [usernameError, setUErr]  = useState('');
  const [passwordError, setPErr]  = useState('');
  const [loginMessage, setMsg]    = useState('');
  const [loading, setLoading]     = useState(false);

  // Checklist
  const [typedSomething, setTypedSomething] = useState(false);
  const [clickedSubmit, setClickedSubmit]   = useState(false);
  const [apiCalled, setApiCalled]           = useState(false);
  const [successShown, setSuccessShown]     = useState(false);
  const [errorShown, setErrorShown]         = useState(false);

  const log = (...a) => { if (debugLog) console.log(...a); };
  const now = () => new Date().toLocaleTimeString();
  const Status = ({ ok }) => (
    <span style={{ display: 'inline-block', minWidth: 20, textAlign: 'center', fontWeight: 700 }}>
      {ok ? '✅' : '❌'}
    </span>
  );

  const validate = () => {
    let ok = true;
    setUErr('');
    setPErr('');

    const u = username.trim();
    const p = password;

    if (!u) { setUErr('Username is required'); ok = false; }
    if (!p) { setPErr('Password is required'); ok = false; }
    return ok;
  };

  // ==== MOCK API duy nhất (không gọi fetch) ====
  const builtinMockApi = async (u, p) => {
    await new Promise(r => setTimeout(r, 200));
    if (u === 'testuser' && p === 'Test123') {
      return { success: true, message: 'thanh cong', token: 'fake-token-123' };
=======
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

  // Mock API tích hợp sẵn
  const builtinMockApi = async (u, p) => {
    await new Promise(r => setTimeout(r, 500));
    if (u === 'testuser' && p === 'Test123') {
      return { 
        success: true, 
        message: 'thanh cong', 
        token: 'fake-token-123',
        user: { username: u, email: `${u}@example.com` }
      };
>>>>>>> Stashed changes
    }
    return { success: false, message: 'sai thong tin' };
  };

<<<<<<< Updated upstream
  const handleSubmit = async (e) => {
    e.preventDefault();
    setClickedSubmit(true);
    setMsg('');
    setSuccessShown(false);
    setErrorShown(false);

    console.groupCollapsed(`🟦 [${now()}] Login.submit`);
    const ok = validate();
    log('✅ Validate:', ok);

    if (!ok) {
      setErrorShown(true);
      console.groupEnd();
=======
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

    // Validation
    if (!validate()) {
>>>>>>> Stashed changes
      return;
    }

    setLoading(true);
<<<<<<< Updated upstream
    setApiCalled(true); // vẫn tính là “đã gọi API” (MOCK)
=======
>>>>>>> Stashed changes
    try {
      const fn = typeof mockApi === 'function' ? mockApi : builtinMockApi;
      const result = await fn(username.trim(), password);

      if (result.success) {
<<<<<<< Updated upstream
        setMsg(result.message || 'thanh cong');
        setSuccessShown(true);
        try { if (result.token) localStorage.setItem('auth_token', result.token); } catch {}
        if (typeof onSuccess === 'function') onSuccess(result.token, result);
        log('✅ Login SUCCESS:', result);
      } else {
        setMsg(result.message || 'Đăng nhập thất bại');
        setErrorShown(true);
        log('❌ Login ERROR:', result);
      }
    } catch (err) {
      setMsg('Network error, please try again');
      setErrorShown(true);
      log('🌩️ Mock error:', err?.message || err);
    } finally {
      setLoading(false);
      console.groupEnd();
=======
        setLoginMessage(result.message || 'thanh cong');
        setIsSuccess(true);
        
        // Store token
        if (result.token) {
          try {
            localStorage.setItem('auth_token', result.token);
          } catch (error) {
            console.error('Failed to store token:', error);
          }
        }

        // Callback
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
>>>>>>> Stashed changes
    }
  };

  return (
<<<<<<< Updated upstream
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr 340px', alignItems: 'start' }}>
      <form onSubmit={handleSubmit} noValidate style={{ border: '1px solid #eee', padding: 16, borderRadius: 12 }}>
        <h3 style={{ marginTop: 0 }}>Login (MOCK)</h3>

        <div style={{ marginBottom: 12 }}>
          <input
            data-testid="username-input"
            value={username}
            onChange={(e) => { setUsername(e.target.value); if (!typedSomething) setTypedSomething(true); }}
            placeholder="Username"
            aria-invalid={!!usernameError}
            aria-describedby={usernameError ? 'username-error' : undefined}
            autoComplete="username"
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
          />
          {usernameError && (
            <span
              id="username-error"
              data-testid="username-error"
              style={{ color: '#c62828', fontSize: 13 }}
            >
              {usernameError}
            </span>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <input
            data-testid="password-input"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (!typedSomething) setTypedSomething(true); }}
            placeholder="Password"
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? 'password-error' : undefined}
            autoComplete="current-password"
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
          />
          {passwordError && (
            <span
              id="password-error"
              data-testid="password-error"
              style={{ color: '#c62828', fontSize: 13 }}
            >
              {passwordError}
            </span>
          )}
        </div>

        <button
          type="submit"
          data-testid="login-button"
          disabled={loading}
          aria-busy={loading}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: 'none',
            background: loading ? '#9e9e9e' : '#1976d2',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600
          }}
        >
          {loading ? 'Đang đăng nhập…' : 'Login'}
        </button>

        {loginMessage && (
          <div
            data-testid="login-message"
            role="status"
            style={{ marginTop: 12, fontWeight: 600, color: successShown ? '#2e7d32' : '#c62828' }}
          >
            {loginMessage}
          </div>
        )}
      </form>

      {/* Checklist hiển thị trên UI */}
      <aside aria-label="Bảng kiểm bài 4.1.1" style={{ border: '1px dashed #bbb', padding: 16, borderRadius: 12, background: '#fafafa', position: 'sticky', top: 10 }}>
        <h4 style={{ marginTop: 0 }}>4.1.1 Component Integration – Checklist</h4>

        <div style={{ marginBottom: 8, fontWeight: 700 }}>(a) Test rendering & user interactions <small>(2 điểm)</small></div>
        <ul style={{ marginTop: 4 }}>
          <li><Status ok={typedSomething} /> Gõ vào input</li>
          <li><Status ok={clickedSubmit} /> Nhấn Submit</li>
          <li><Status ok={!!(usernameError || passwordError)} /> Hiện lỗi validate khi sai</li>
        </ul>

        <div style={{ margin: '10px 0 8px', fontWeight: 700 }}>(b) Test form submission & API calls <small>(2 điểm)</small></div>
        <ul style={{ marginTop: 4 }}>
          <li><Status ok={apiCalled} /> Đã “gọi API” (MOCK)</li>
        </ul>

        <div style={{ margin: '10px 0 8px', fontWeight: 700 }}>(c) Test error handling & success messages <small>(1 điểm)</small></div>
        <ul style={{ marginTop: 4 }}>
          <li><Status ok={successShown} /> Hiển thị <code>thanh cong</code> khi OK</li>
          <li><Status ok={errorShown} /> Hiển thị lỗi khi 401/Network/validate fail</li>
        </ul>
      </aside>
=======
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
            </svg>
          </div>
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="login-form">
          <div className="form-group">
            <label htmlFor="username-input" className="form-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
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
              <span
                id="username-error"
                data-testid="username-error"
                className="error-message"
                role="alert"
              >
                {usernameError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password-input" className="form-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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
              <span
                id="password-error"
                data-testid="password-error"
                className="error-message"
                role="alert"
              >
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
                  <path d="M5 12h14M12 5l7 7-7 7"/>
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
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"/>
                ) : (
                  <circle cx="12" cy="12" r="10"/>
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
>>>>>>> Stashed changes
    </div>
  );
}
