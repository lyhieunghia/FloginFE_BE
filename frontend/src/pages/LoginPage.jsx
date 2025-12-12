import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { validateLoginForm } from '../utils/loginValidation';
import { useAuth } from '../auth/AuthProvider';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  // Redirect nếu đã login
  useEffect(() => {
    if (user) {
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setLoginMessage('');
    setIsSuccess(false);
    setUsernameError('');
    setPasswordError('');

    // Client-side validation
    const { isValid, usernameError, passwordError } = validateLoginForm(
      username,
      password
    );

    if (!isValid) {
      setUsernameError(usernameError);
      setPasswordError(passwordError);
      setLoginMessage('Vui lòng kiểm tra thông tin đăng nhập');
      return;
    }

    setLoading(true);

    try {
      // Call AuthProvider login (sử dụng HttpOnly cookie)
      const result = await login(username, password);

      if (result.success) {
        setLoginMessage('Đăng nhập thành công');
        setIsSuccess(true);

        // Navigate to return URL or home
        const from = location.state?.from || '/';
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        setLoginMessage('Tên đăng nhập hoặc mật khẩu không đúng');
        setIsSuccess(false);
      }
    } catch (error) {
      // Don't log error details to console (security)
      setLoginMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
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