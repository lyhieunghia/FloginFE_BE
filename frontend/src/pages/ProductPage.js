// src/pages/ProductPage.js
// Đây là file đã được cập nhật giao diện với Bootstrap


import React, { useState, useEffect } from 'react';
import { ProductList } from '../components/ProductList';
import { ProductForm } from '../components/ProductForm';
import * as productService from '../services/productService';

export const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  const fetchProducts = () => {
    productService.getAllProducts()
      .then(response => {
        const productList = Array.isArray(response.data) 
          ? response.data 
          : (response.data && Array.isArray(response.data.content)) 
            ? response.data.content 
            : [];
            
        setProducts(productList);
      })
      .catch(error => {
        setMessage('Lỗi khi tải danh sách sản phẩm');
        console.error(error);
        setProducts([]); 
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []); 

  const handleAddProduct = (product) => {
    productService.createProduct(product)
      .then(response => {
        setMessage('Thêm sản phẩm thành công!');
        fetchProducts(); // Tải lại toàn bộ danh sách
      })
      .catch(error => {
        setMessage('Lỗi khi thêm sản phẩm');
        console.error(error);
      });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      productService.deleteProduct(id)
        .then(() => {
          setMessage('Xóa sản phẩm thành công!');
          fetchProducts(); // Tải lại toàn bộ danh sách
        })
        .catch(error => {
          setMessage('Lỗi khi xóa sản phẩm');
          console.error(error);
        });
    }
  };
  
  const handleEditProduct = (product) => {
    console.log('Chuẩn bị sửa:', product);
    alert(`Chức năng Sửa cho sản phẩm: ${product.name} (chưa cài đặt)`);
  };

  // --- Cập nhật giao diện (UI) với Bootstrap ---
  return (
    <main className="container">
      {/* Thông báo (Alerts) */}
      {message && (
        <div 
          data-testid="success-message" 
          // Tự động đổi màu alert dựa trên nội dung message
          className={`alert ${message.includes('Lỗi') ? 'alert-danger' : 'alert-success'}`}
          role="alert"
        >
          {message}
        </div>
      )}

      {/* Bố cục 2 cột (Form và List) */}
      <div className="row g-5">
        
        {/* Cột 1: Form Thêm Sản Phẩm */}
        <div className="col-md-4">
          <h2 className="h4">Thêm Sản Phẩm</h2>
          <ProductForm onSubmit={handleAddProduct} />
        </div>

        {/* Cột 2: Danh Sách Sản Phẩm */}
        <div className="col-md-8">
          <h2 className="h4">Danh sách Sản phẩm</h2>
          <div className="card shadow-sm">
            <ProductList 
              products={products} 
              onEdit={handleEditProduct} 
              onDelete={handleDeleteProduct} 
            />
          </div>
        </div>
      </div>

    </main>
  );
}