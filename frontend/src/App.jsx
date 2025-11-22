import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import { loginApi } from './services/apiService';

import { ProductPage } from './pages/ProductPage';
import { ProductDetail } from './components/ProductDetail';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login mockApi={loginApi} onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <header>
        <h1>Quản lý Sản phẩm (Flogin)</h1>
      </header>

      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Nếu URL không hợp lệ → quay về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </div>
  );
}

export default App;
