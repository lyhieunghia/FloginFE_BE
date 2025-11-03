
import React, { useState } from 'react';
import { validateUsername, validatePassword } from './utils/validation';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
      setErrors({ username: usernameError, password: passwordError });
      setMessage('');
    } else {
      setErrors({});
      setMessage('Đăng nhập thành công!');
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Tên đăng nhập:</label>
          <input
            data-testid="username-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <div data-testid="username-error" style={{ color: 'red' }}>
              {errors.username}
            </div>
          )}
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input
            data-testid="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <div data-testid="password-error" style={{ color: 'red' }}>
              {errors.password}
            </div>
          )}
        </div>
        <button type="submit" data-testid="login-button">Đăng nhập</button>
      </form>
      {message && (
        <div data-testid="login-message" style={{ color: 'green', marginTop: 10 }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default App;
