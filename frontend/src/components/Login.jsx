// src/components/Login.jsx
import React, { useState } from 'react';

/**
 * Props:
 * - baseUrl: prefix API (mặc định rỗng để dễ mock)
 * - onSuccess(token, payload)
 * - debugLog: bật/tắt console log (mặc định true)
 */
export default function Login({ baseUrl = '', onSuccess, debugLog = true }) {
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [usernameError, setUErr]  = useState('');
  const [passwordError, setPErr]  = useState('');
  const [loginMessage, setMsg]    = useState('');
  const [loading, setLoading]     = useState(false);

  // --- Checklist state (UI minh hoạ chấm điểm) ---
  const [typedSomething, setTypedSomething] = useState(false);
  const [clickedSubmit, setClickedSubmit]   = useState(false);
  const [apiCalled, setApiCalled]           = useState(false);
  const [successShown, setSuccessShown]     = useState(false);
  const [errorShown, setErrorShown]         = useState(false);

  const Status = ({ ok }) => (
    <span style={{ display: 'inline-block', minWidth: 20, textAlign: 'center', fontWeight: 700 }}>
      {ok ? '✅' : '❌'}
    </span>
  );

  // Helper log
  const log = (...args) => { if (debugLog) console.log(...args); };
  const now = () => new Date().toLocaleTimeString();

  const validate = () => {
    let ok = true;
    setUErr('');
    setPErr('');

    const u = username.trim();
    const p = password;

    if (!u) {
      setUErr('Username is required');
      ok = false;
    }
    if (!p) {
      setPErr('Password is required');
      ok = false;
    }
    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClickedSubmit(true);
    setMsg('');
    setSuccessShown(false);
    setErrorShown(false);

    console.groupCollapsed(`🟦 [${now()}] Login.submit`);
    log('➡️ Submit pressed');
    log('Current form value:', {
      username: username.trim(),
      password: password ? `*** (${password.length} chars)` : '(empty)',
    });

    const isValid = validate();
    log('✅ Validate result:', isValid);

    if (!isValid) {
      setErrorShown(true);
      console.groupEnd();
      return;
    }

    setLoading(true);
    const url = `${baseUrl}/api/auth/login`;
    const payload = { username: username.trim(), password };
    const t0 = performance.now();

    try {
      setApiCalled(true);
      log('🌐 Calling API:', url);
      log('📦 Request body:', { ...payload, password: '***' });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const dt = (performance.now() - t0).toFixed(1) + 'ms';
      log('📥 Response status:', res.status, res.ok ? '(OK)' : '(NOT OK)', `in ${dt}`);

      let data = {};
      try {
        data = await res.json();
        log('🧾 Response JSON:', data);
      } catch (_) {
        log('⚠️ Response has no/invalid JSON body.');
      }

      const tokenFromHeader = res.headers.get('X-Auth-Token');
      if (tokenFromHeader) log('🔑 X-Auth-Token (header):', tokenFromHeader);

      if (res.ok && data?.success) {
        const token = tokenFromHeader || data.token;
        if (token) {
          try {
            localStorage.setItem('auth_token', token);
            log('💾 Stored token to localStorage');
          } catch (e) {
            log('⚠️ Cannot access localStorage:', e?.message);
          }
        }
        const msg = data?.message || 'thanh cong';
        setMsg(msg);
        setSuccessShown(true);
        log('✅ Login SUCCESS:', msg);

        if (typeof onSuccess === 'function') onSuccess(tokenFromHeader || data.token, data);
      } else {
        const msg = data?.message || 'Đăng nhập thất bại';
        setMsg(msg);
        setErrorShown(true);
        log('❌ Login ERROR:', msg);
      }
    } catch (err) {
      setMsg('Network error, please try again');
      setErrorShown(true);
      log('🌩️ Network error:', err?.message || err);
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  return (
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr 340px', alignItems: 'start' }}>
      <form onSubmit={handleSubmit} noValidate style={{ border: '1px solid #eee', padding: 16, borderRadius: 12 }}>
        <h3 style={{ marginTop: 0 }}>Login</h3>

        <div style={{ marginBottom: 12 }}>
          <input
            data-testid="username-input"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (!typedSomething) setTypedSomething(true);
              log(`⌨️ [${now()}] username changed →`, e.target.value);
            }}
            placeholder="Username"
            aria-invalid={!!usernameError}
            aria-describedby={usernameError ? 'username-error' : undefined}
            autoComplete="username"
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
          />
          {usernameError && (
            <span id="username-error" data-testid="username-error" style={{ color: '#c62828', fontSize: 13 }}>
              {usernameError}
            </span>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
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
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? 'password-error' : undefined}
            autoComplete="current-password"
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
          />
          {passwordError && (
            <span id="password-error" data-testid="password-error" style={{ color: '#c62828', fontSize: 13 }}>
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
            fontWeight: 600,
          }}
          onClick={() => log(`🖱️ [${now()}] submit clicked`)}
        >
          {loading ? 'Đang đăng nhập…' : 'Login'}
        </button>

        {loginMessage && (
          <div
            data-testid="login-message"
            role="status"
            style={{
              marginTop: 12,
              fontWeight: 600,
              color: successShown ? '#2e7d32' : '#c62828',
            }}
          >
            {loginMessage}
          </div>
        )}
      </form>

      {/* Bảng kiểm chấm điểm hiển thị trực tiếp trên frontend */}
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
          <li><Status ok={!!(usernameError || passwordError)} /> Lỗi validate hiển thị khi form rỗng/sai</li>
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
  );
}
