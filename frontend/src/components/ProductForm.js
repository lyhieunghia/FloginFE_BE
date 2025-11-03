import React, { useState } from "react";
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Tên sản phẩm:</label>
        <input
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          data-testid="product-name"
        />
        {errors.name && <span data-testid="error-name">{errors.name}</span>}
      </div>
      <div>
        <label htmlFor="price">Giá:</label>
        <input
          id="price"
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
          data-testid="product-price"
        />
        {errors.price && <span data-testid="error-price">{errors.price}</span>}
      </div>
      <div>
        <label htmlFor="quantity">Số lượng:</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          value={product.quantity}
          onChange={handleChange}
          data-testid="product-quantity"
        />
        {errors.quantity && (
          <span data-testid="error-quantity">{errors.quantity}</span>
        )}
      </div>
      <div>
        <label htmlFor="category">Danh mục:</label>
        <input
          id="category"
          name="category"
          value={product.category}
          onChange={handleChange}
          data-testid="product-category"
        />
        {errors.category && (
          <span data-testid="error-category">{errors.category}</span>
        )}
      </div>
      <button type="submit" data-testid="submit-button">
        Lưu
      </button>
    </form>
  );
};
