// src/components/ProductList.js
// Đây là file đã được cập nhật giao diện với Bootstrap

import React from "react";
import { Link } from 'react-router-dom';

export const ProductList = ({ products, onEdit, onDelete }) => {
  if (!Array.isArray(products) || products.length === 0) {
    // Cập nhật: Thêm class cho thông báo
    return <p className="p-3 text-center">Không có sản phẩm nào.</p>;
  }

  // Cập nhật: Giao diện Bảng với Bootstrap
  return (
    // Thêm class 'table-responsive' để bảng cuộn ngang trên di động
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle mb-0">
        <thead className="table-dark">
          <tr>
            <th scope="col">Tên sản phẩm</th>
            <th scope="col">Giá</th>
            <th scope="col">Số lượng</th>
            <th scope="col" className="text-end">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} data-testid={`product-item-${product.id}`}>
              <td>
                {/* Link này đã đúng với route /products/:id */}
                <Link to={`/products/${product.id}`} data-testid={`product-link-${product.id}`}>
                  {product.name}
                </Link>
              </td>
              <td>{product.price.toLocaleString()} VND</td>
              <td>{product.quantity}</td>
              <td className="text-end">
                <button
                  onClick={() => onEdit(product)}
                  data-testid={`edit-btn-${product.id}`}
                  className="btn btn-sm btn-outline-primary me-2" // Nút Sửa
                >
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  data-testid={`delete-btn-${product.id}`}
                  className="btn btn-sm btn-outline-danger" // Nút Xóa
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
