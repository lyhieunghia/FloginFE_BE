// src/components/ProductForm.js
// Đây là file đã được cập nhật giao diện với Bootstrap

import React, { useState } from "react";
// Giả định bạn có file validation này tại /utils/productValidation.js
import { validateProduct } from "../utils/productValidation";

export const ProductForm = ({ onSubmit }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    category: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateProduct(product);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(product);
      // Cải tiến: Xóa form sau khi submit thành công
      setProduct({ name: "", price: "", quantity: "", description: "", category: "" });
    }
  };

  // --- Cập nhật giao diện (UI) với Bootstrap ---
  return (
    // Bọc form trong card để trực quan hơn
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
              value={product.price}
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
              value={product.quantity}
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
            Lưu
          </button>
        </form>
      </div>
    </div>
  );
};

