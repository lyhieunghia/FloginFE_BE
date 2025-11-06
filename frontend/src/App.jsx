// src/App.jsx
import React, { useState } from 'react';
import { validateUsername, validatePassword } from './utils/validation';

/**
 * Props:
 * - baseUrl: prefix API (mặc định rỗng)
 * - debugLog: bật/tắt console log (mặc định true)
 */
export default function App({ baseUrl = '', debugLog = true }) {
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [errors, setErrors]       = useState({ username: '', password: '' });
  const [message, setMessage]     = useState('');
  const [loading, setLoading]     = useState(false);

  // Checklist trạng thái hiển thị trên UI
  const [typedSomething, setTypedSomething] = useState(false);
  const [clickedSubmit, setClickedSubmit]   = useState(false);
  const [apiCalled, setApiCalled]           = useState(false);
  const [successShown, setSuccessShown]     = useState(false);
  const [errorShown, setErrorShown]         = useState(false);

  const now = () => new Date().toLocaleTimeString();
  const log = (...a) => { if (debugLog) console.log(...a); };
  const Status = ({ ok }) => (
    <span style={{ display: 'inline-block', minWidth: 20, textAlign: 'center', fontWeight: 700 }}>
      {ok ? '✅' : '❌'}
    </span>
  );

  const runValidation = () => {
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    setErrors({ username: usernameError || '', password: passwordError || '' });
    return !(usernameError || passwordError);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setClickedSubmit(true);
    setMessage('');
    setSuccessShown(false);
    setErrorShown(false);

    console.groupCollapsed(`🟦 [${now()}] App.handleLogin`);
    log('➡️ Submit pressed');
    log('Form value:', {
      username: username.trim(),
      password: password ? `*** (${password.length} chars)` : '(empty)',
    });

    const isValid = runValidation();
    log('✅ Validation result:', isValid, 'errors:', errors);

    if (!isValid) {
      setErrorShown(true);
      console.groupEnd();
      return;
    }

    // Gọi API thật (hoặc để MSW mock trong test)
    setLoading(true);
    const url = `${baseUrl}/api/auth/login`;
    const body = { username: username.trim(), password };

    try {
      setApiCalled(true);
      log('🌐 Calling API:', url);
      log('📦 Request body:', { ...body, password: '***' });

      const t0 = performance.now();
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const dt = (performance.now() - t0).toFixed(1) + 'ms';
      log('📥 Response status:', res.status, res.ok ? '(OK)' : '(NOT OK)', `in ${dt}`);

      let data = {};
      try {
        data = await res.json();
        log('🧾 Response JSON:', data);
      } catch {
        log('⚠️ No/invalid JSON body');
      }

      const tokenHeader = res.headers.get('X-Auth-Token');
      if (tokenHeader) log('🔑 X-Auth-Token:', tokenHeader);

      if (res.ok && data?.success) {
        const token = tokenHeader || data.token;
        try { if (token) localStorage.setItem('auth_token', token); } catch {}
        const msg = data?.message || 'thanh cong';
        setMessage(msg);
        setSuccessShown(true);
        log('✅ SUCCESS:', msg);
      } else {
        const msg = data?.message || 'Đăng nhập thất bại';
        setMessage(msg);
        setErrorShown(true);
        log('❌ ERROR:', msg);
      }
    } catch (err) {
      setMessage('Network error, please try again');
      setErrorShown(true);
      log('🌩️ Network error:', err?.message || err);
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr 340px', alignItems: 'start' }}>
        {/* Form */}
        <form onSubmit={handleLogin} style={{ border: '1px solid #eee', padding: 16, borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Đăng nhập</h2>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Tên đăng nhập:</label>
            <input
              data-testid="username-input"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (!typedSomething) setTypedSomething(true);
                log(`⌨️ [${now()}] username changed →`, e.target.value);
              }}
              placeholder="Username"
              autoComplete="username"
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
            />
            {errors.username && (
              <div id="username-error" data-testid="username-error" style={{ color: 'red', fontSize: 13 }}>
                {errors.username}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Mật khẩu:</label>
            <input
              data-testid="password-input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (!typedSomething) setTypedSomething(true);
                const len = e.target.value?.length ?? 0;
                log(`⌨️ [${now()}] password changed → *** (${len} chars)`);
              }}
              placeholder="Password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
            />
            {errors.password && (
              <div id="password-error" data-testid="password-error" style={{ color: 'red', fontSize: 13 }}>
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            data-testid="login-button"
            disabled={loading}
            aria-busy={loading}
            onClick={() => log(`🖱️ [${now()}] submit clicked`)}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              background: loading ? '#9e9e9e' : '#1976d2',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </button>

          {message && (
            <div
              data-testid="login-message"
              role="status"
              style={{ color: successShown ? '#2e7d32' : '#c62828', marginTop: 10, fontWeight: 600 }}
            >
              {message}
            </div>
          )}
        </form>

        {/* Bảng kiểm 4.1.1 hiển thị trên frontend */}
        <aside
          aria-label="Bảng kiểm bài 4.1.1"
          style={{
            border: '1px dashed #bbb',
            padding: 16,
            borderRadius: 12,
            background: '#fafafa',
            position: 'sticky',
            top: 10,
          }}
        >
          <h4 style={{ marginTop: 0 }}>4.1.1 Component Integration – Checklist</h4>

          <div style={{ marginBottom: 8, fontWeight: 700 }}>
            (a) Test rendering & user interactions <small>(2 điểm)</small>
          </div>
          <ul style={{ marginTop: 4 }}>
            <li><Status ok={typedSomething} /> Đã tương tác ô nhập (gõ vào input)</li>
            <li><Status ok={clickedSubmit} /> Đã nhấn Submit (kích hoạt validate)</li>
            <li><Status ok={!!(errors.username || errors.password)} /> Lỗi validate hiển thị khi form rỗng/sai</li>
          </ul>

          <div style={{ margin: '10px 0 8px', fontWeight: 700 }}>
            (b) Test form submission & API calls <small>(2 điểm)</small>
          </div>
          <ul style={{ marginTop: 4 }}>
            <li><Status ok={apiCalled} /> Đã gọi API <code>/api/auth/login</code></li>
          </ul>

          <div style={{ margin: '10px 0 8px', fontWeight: 700 }}>
            (c) Test error handling & success messages <small>(1 điểm)</small>
          </div>
          <ul style={{ marginTop: 4 }}>
            <li><Status ok={successShown} /> Hiển thị thông điệp <code>thanh cong</code> khi login OK</li>
            <li><Status ok={errorShown} /> Hiển thị thông điệp lỗi khi 401/Network/validate fail</li>
          </ul>

          <p style={{ fontSize: 12, color: '#666' }}>
            Mở DevTools → Console để xem log chi tiết mọi bước (input, submit, API, response).
          </p>
        </aside>
      </div>
    </div>
  );
}
