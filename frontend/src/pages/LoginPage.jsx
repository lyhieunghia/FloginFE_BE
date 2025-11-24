import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { validateLoginForm } from '../utils/loginValidation';
import { mockLogin, storeAuthToken } from '../services/authService';

export default function LoginPage({ mockApi, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hook để điều hướng
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setLoginMessage('');
    setIsSuccess(false);
    setUsernameError('');
    setPasswordError('');

    // Validate form
    const { isValid, usernameError, passwordError } = validateLoginForm(
      username,
      password
    );

    setUsernameError(usernameError);
    setPasswordError(passwordError);

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      // Use mockApi if provided, otherwise use mockLogin
      const apiFunction = mockApi || mockLogin;
      const result = await apiFunction(username, password);

      if (result.success) {
        // Login successful
        setLoginMessage(result.message || 'thanh cong');
        setIsSuccess(true);

        // Store token if provided
        if (result.token) {
          storeAuthToken(result.token);
        }

        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          // Default behavior: navigate to home after delay
          setTimeout(() => {
            navigate('/');
          }, 1500);
        }
      } else {
        // Login failed
        setLoginMessage(result.message || 'sai thong tin');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginMessage(error.message || 'Network error, please try again');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      username={username}
      password={password}
      usernameError={usernameError}
      passwordError={passwordError}
      loginMessage={loginMessage}
      isSuccess={isSuccess}
      loading={loading}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
}