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

  // Đây là phần UI của trang
  return (
    <main>
      {message && <div data-testid="success-message" className="message">{message}</div>}

      <ProductForm onSubmit={handleAddProduct} />

      <h2>Danh sách Sản phẩm</h2>
      <ProductList 
        products={products} 
        onEdit={handleEditProduct} 
        onDelete={handleDeleteProduct} 
      />
    </main>
  );
}