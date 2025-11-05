// Login.js (simplified example)
import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset previous messages
    setUsernameError('');
    setPasswordError('');
    setLoginMessage('');

    // Basic validation
    if (!username) setUsernameError('Username is required');
    if (!password) setPasswordError('Password is required');
    if (!username || !password) return;

    try {
      // Call backend API
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // On success, maybe store token and show success message
        const token = response.headers.get('X-Auth-Token');
        // (Store token in auth context or localStorage as needed)
        setLoginMessage('thành công');  // login successful message
      } else {
        // On error (e.g., 401 Unauthorized), show error message from response
        setLoginMessage(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      setLoginMessage('Network error, please try again');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input 
          data-testid="username-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username" />
        {usernameError && <span data-testid="username-error">{usernameError}</span>}
      </div>
      <div>
        <input 
          data-testid="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" />
        {passwordError && <span data-testid="password-error">{passwordError}</span>}
      </div>
      <button type="submit" data-testid="login-button">Login</button>
      {loginMessage && <div data-testid="login-message">{loginMessage}</div>}
    </form>
  );
}

export default Login;
