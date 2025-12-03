// src/pages/ProductPage.js
import React, { useState, useEffect } from 'react';
import { ProductList } from '../components/ProductList';
import { ProductForm } from '../components/ProductForm';
import * as productService from '../services/productService';

export const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  // SỬA: State để lưu sản phẩm đang được chỉnh sửa
  const [editingProduct, setEditingProduct] = useState(null);

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
        let errMsg = error.response
          ? `Lỗi ${error.response.status} - ${error.response.data?.message || ''}`
          : 'Network Error';
        setMessage(`Lỗi khi tải danh sách sản phẩm: ${errMsg}`);
        console.error(error);
        setProducts([]); 
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []); 

  // SỬA: HÀM SUBMIT CHUNG CHO CẢ CREATE VÀ UPDATE
  const handleFormSubmit = (product) => {
    if (editingProduct) {
      // --- LOGIC CẬP NHẬT (UPDATE) ---
      // Gọi service updateProduct (sử dụng ID từ editingProduct)
      productService.updateProduct(editingProduct.id, product)
        .then(() => {
          setMessage('Cập nhật sản phẩm thành công!');
          fetchProducts(); // Tải lại danh sách
          setEditingProduct(null); // Rất quan trọng: Reset form về chế độ Thêm mới
        })
        .catch(error => {
          let errMsg = error.response
            ? `Lỗi ${error.response.status} - ${error.response.data?.message || ''}`
            : 'Network Error';
          setMessage(`Lỗi khi cập nhật sản phẩm: ${errMsg}`);
          console.error(error);
        });

    } else {
      // --- LOGIC THÊM MỚI (CREATE) ---
      productService.createProduct(product)
        .then(() => {
          setMessage('Thêm sản phẩm thành công!');
          fetchProducts(); // Tải lại danh sách
          setEditingProduct(null); // Rất quan trọng: Reset form sau khi thêm mới
        })
        .catch(error => {
          let errMsg = error.response
            ? `Lỗi ${error.response.status} - ${error.response.data?.message || ''}`
            : 'Network Error';
          setMessage(`Lỗi khi thêm sản phẩm: ${errMsg}`);
          console.error(error);
        });
    }
  };

  // SỬA: HÀM XỬ LÝ KHI NHẤN NÚT SỬA
  const handleEditProduct = (product) => {
    console.log('Chuẩn bị sửa:', product);
    setEditingProduct(product); // Set sản phẩm vào state
    
    // Cuộn lên đầu trang để người dùng có thể thấy form
    // Giả định bạn đã cài 'scroll-to-element' hoặc dùng window.scrollTo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMessage(''); // Xóa thông báo cũ
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      productService.deleteProduct(id)
        .then(() => {
          setMessage('Xóa sản phẩm thành công!');
          fetchProducts(); // Tải lại toàn bộ danh sách
          if (editingProduct && editingProduct.id === id) {
             setEditingProduct(null); // Nếu xóa sản phẩm đang sửa, reset form
          }
        })
        .catch(error => {
          let errMsg = error.response
            ? `Lỗi ${error.response.status} - ${error.response.data?.message || ''}`
            : 'Network Error';
          setMessage(`Lỗi khi xóa sản phẩm: ${errMsg}`);
          console.error(error);
        });
    }
  };
  
  // Nút Hủy Sửa (Tùy chọn)
  const handleCancelEdit = () => {
      setEditingProduct(null);
      setMessage('');
  };


  return (
    <main className="container">
      {/* Thông báo (Alerts) */}
      {message && (
        <div 
          data-testid="success-message" 
          className={`alert ${message.includes('Lỗi') ? 'alert-danger' : 'alert-success'}`}
          role="alert"
        >
          {message}
        </div>
      )}

      {/* Bố cục 2 cột (Form và List) */}
      <div className="row g-5">
        
        {/* Cột 1: Form Thêm/Sửa Sản Phẩm */}
        <div className="col-md-4">
          <h2 className="h4">
            {editingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}
          </h2>
          
          {/* Nút Hủy Sửa */}
          {editingProduct && (
            <button 
                onClick={handleCancelEdit}
                className="btn btn-sm btn-outline-secondary mb-3 w-100"
                data-testid="cancel-edit-button"
            >
                &larr; Hủy Sửa
            </button>
          )}

          {/* SỬA: TRUYỀN HÀM CHUNG VÀ SẢN PHẨM ĐANG SỬA */}
          <ProductForm 
            onSubmit={handleFormSubmit} 
            productToEdit={editingProduct} 
          />
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