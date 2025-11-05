import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService'; // Import hàm mới

export const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams(); // Lấy 'id' từ URL (ví dụ: /products/1)

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
  }, [id]); // Chạy lại nếu 'id' thay đổi

  if (error) {
    return <div data-testid="error-message">{error}</div>;
  }

  if (!product) {
    return <div>Đang tải...</div>;
  }

  // Giao diện chi tiết
  return (
    <div>
      <Link to="/">Quay về danh sách</Link>
      <h1 data-testid="product-detail-name">{product.name}</h1>
      <p data-testid="product-detail-price">Giá: {product.price?.toLocaleString()} VND</p>
      <p data-testid="product-detail-quantity">Số lượng: {product.quantity}</p>
      <p data-testid="product-detail-category">Danh mục: {product.category}</p>
    </div>
  );
};