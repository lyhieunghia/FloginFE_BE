import React from 'react';
import Login from './components/Login';
import { loginApi } from './services/apiService';
import './App.css';

/**
 * Main App Component quản lý authentication flow và routing
 */
export default function App() {
  const handleLoginSuccess = (token, userData) => {
    console.log('✅ Login successful!');
    console.log('📝 Token:', token);
    console.log('👤 User data:', userData);
    // TODO: navigate or update global state if needed
  };
  return (
    <div className="App">
      <Login mockApi={loginApi} onSuccess={handleLoginSuccess} />
    </div>
  );
}
