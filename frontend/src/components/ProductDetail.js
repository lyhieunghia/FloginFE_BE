// src/components/ProductDetail.js
// Đây là file đã được cập nhật giao diện với Bootstrap

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';

export const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getProductById(id)
        .then(response => {
          setProduct(response.data);
        })
        .catch(err => {
          setError('Không tìm thấy sản phẩm');
          console.error(err);
        });
    }

  }, [id]); 

  // Cập nhật: Hiển thị lỗi dùng Alert của Bootstrap
  if (error) {
    return (
      <div className="alert alert-danger" data-testid="error-message">
        {error}
      </div>
    );
  }

  if (!product) {
    return <div>Đang tải...</div>;
  }

  // --- Cập nhật giao diện (UI) với Bootstrap Card ---
  return (
    <div className="container mt-4">
      {/* Nút quay lại - Sửa link thành /products (theo flow đã đổi) */}
      <Link to="/products" className="btn btn-outline-secondary mb-3">
        &larr; Quay về danh sách
      </Link>

      {/* Bảng thông tin sản phẩm */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h1 data-testid="product-detail-name" className="card-title h3 mb-0">
            {product.name}
          </h1>
        </div>
        <div className="card-body">
          <p data-testid="product-detail-price" className="card-text h5 text-success">
            Giá: {product.price?.toLocaleString()} VND
          </p>
          <p data-testid="product-detail-quantity" className="card-text">
            Số lượng: {product.quantity}
          </p>
          <p data-testid="product-detail-category" className="card-text text-muted">
            Danh mục: {product.category}
          </p>
        </div>
      </div>

    </div>
  );
};