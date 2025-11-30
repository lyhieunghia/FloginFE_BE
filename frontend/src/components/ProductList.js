import React from "react";
import { Link } from 'react-router-dom';

// Nhận vào danh sách sản phẩm (products) và các hàm xử lý
export const ProductList = ({ products, onEdit, onDelete }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return <p>Không có sản phẩm nào.</p>;
  }

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Tên sản phẩm</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} data-testid={`product-item-${product.id}`}>
            <td>
              <Link to={`/products/${product.id}`} data-testid={`product-link-${product.id}`}>
                {product.name}
              </Link>
            </td>
            <td>{product.price.toLocaleString()} VND</td>
            <td>{product.quantity}</td>
            <td>
              <button
                onClick={() => onEdit(product)}
                data-testid={`edit-btn-${product.id}`}
              >
                Sửa
              </button>
              <button
                onClick={() => onDelete(product.id)}
                data-testid={`delete-btn-${product.id}`}
                className="delete-button"
              >
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
