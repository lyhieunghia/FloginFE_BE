// src/components/ProductForm.js

import React, { useState, useEffect } from "react";
import { validateProduct } from "../utils/productValidation";

export const ProductForm = ({ onSubmit, productToEdit }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setProduct({
        // Đảm bảo các trường không liên quan đến form (như id) vẫn được giữ
        ...productToEdit, 
        // Chuyển đổi giá trị số sang chuỗi để điền vào input type="number"
        price: productToEdit.price != null ? String(productToEdit.price) : '',
        quantity: productToEdit.quantity != null ? String(productToEdit.quantity) : '',
      });
      setErrors({}); 
    } else {
      setProduct({
        name: "",
        price: "",
        quantity: "",
        description: "",
        category: "",
      });
      setErrors({}); 
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateProduct(product);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {

      // 1. Chuyển đổi dữ liệu (từ string sang number)
      const finalProduct = {
          ...product,
          price: Number(product.price),
          quantity: Number(product.quantity),
      };
      
      // 2. 🟢 SỬA LỖI QUAN TRỌNG: Gọi onSubmit với dữ liệu đã chuyển đổi (finalProduct)
      onSubmit(finalProduct); 
    }
  };

  // --- Cập nhật giao diện (UI) với Bootstrap ---
  return (
    // ... (Phần JSX giữ nguyên, vì nó đã đúng) ...
    <div className="card shadow-sm">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          
          {/* Trường Tên sản phẩm */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Tên sản phẩm:</label>
            <input
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              data-testid="product-name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && 
              <div data-testid="error-name" className="invalid-feedback">
                {errors.name}
              </div>
            }
          </div>
          
          {/* Trường Giá */}
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Giá:</label>
            <input
              id="price"
              name="price"
              type="number"
              value={product.price || ''} 
              onChange={handleChange}
              data-testid="product-price"
              className={`form-control ${errors.price ? 'is-invalid' : ''}`}
            />
            {errors.price && 
              <div data-testid="error-price" className="invalid-feedback">
                {errors.price}
              </div>
            }
          </div>
          
          {/* Trường Số lượng */}
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Số lượng:</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={product.quantity || ''}
              onChange={handleChange}
              data-testid="product-quantity"
              className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
            />
            {errors.quantity && (
              <div data-testid="error-quantity" className="invalid-feedback">
                {errors.quantity}
              </div>
            )}
          </div>
          
          {/* Trường Danh mục */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Danh mục:</label>
            <input
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              data-testid="product-category"
              className={`form-control ${errors.category ? 'is-invalid' : ''}`}
            />
            {errors.category && (
              <div data-testid="error-category" className="invalid-feedback">
                {errors.category}
              </div>
            )}
          </div>
          
          {/* Nút Submit */}
          <button type="submit" data-testid="submit-button" className="btn btn-primary w-100">
            {productToEdit ? 'Cập nhật' : 'Lưu'}
          </button>
        </form>
      </div>
    </div>
  );
};