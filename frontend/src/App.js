import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProductPage } from './pages/ProductPage'; // (Chúng ta sẽ tạo file này ở Bước 3)
import { ProductDetail } from './components/ProductDetail'; // (Chúng ta sẽ tạo file này ở Bước 3)
import './App.css'; 

function App() {
  return (
    <div className="App">
      <header>
        <h1>Quản lý Sản phẩm (Flogin)</h1>
      </header>
      
      {/* Định nghĩa các tuyến đường */}
      <Routes>
        {/* URL: / (trang chủ) -> Hiển thị trang Quản lý Sản phẩm */}
        <Route path="/" element={<ProductPage />} />
        
        {/* URL: /products/1 (ví dụ) -> Hiển thị trang Chi tiết Sản phẩm */}
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>

    </div>
  );
}

export default App;