import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ProductPage } from './pages/ProductPage';
import { ProductDetail } from './components/ProductDetail';
import Login from './components/Login.jsx'; // 1. THÊM IMPORT

import './App.css'; 

function App() {
  return (
    <div className="App">
      <header>
        <h1>Quản lý Sản phẩm (Flogin)</h1>
      </header>
      

      {/* 2. CẬP NHẬT ROUTES */}
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/products" element={<ProductPage />} />
        
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>

    </div>
  );
}

export default App;