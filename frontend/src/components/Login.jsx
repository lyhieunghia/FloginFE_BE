// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const navigate = useNavigate();
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
    }
    return { success: false, message: 'sai thong tin' };
  };

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
      return;
    }

    setLoading(true);
    setApiCalled(true); // vẫn tính là “đã gọi API” (MOCK)
    try {
      const fn = typeof mockApi === 'function' ? mockApi : builtinMockApi;
      const result = await fn(username.trim(), password);

      if (result.success) {
        setMsg(result.message || 'thanh cong');
        setSuccessShown(true);
        try { if (result.token) localStorage.setItem('auth_token', result.token); } catch {}
        if (typeof onSuccess === 'function') onSuccess(result.token, result);
        log('✅ Login SUCCESS:', result);

        setTimeout(() => {
          navigate('/products'); // Chuyển về trang chủ (ProductPage)
        }, 1000);

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
    }
  };

  return (
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
    </div>
  );
}
