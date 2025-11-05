import React, { useState, useEffect } from 'react';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import * as productService from './services/productService';
import './App.css'; // Import file CSS

function App() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(''); // Để hiển thị thông báo

  // 1. Tải danh sách sản phẩm khi component được render (READ)
  useEffect(() => {
    productService.getAllProducts()
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        setMessage('Lỗi khi tải danh sách sản phẩm');
        console.error(error);
      });
  }, []); // [] đảm bảo chỉ chạy 1 lần

  // 2. Xử lý thêm sản phẩm (CREATE)
  const handleAddProduct = (product) => {
    productService.createProduct(product)
      .then(response => {
        // Thêm sản phẩm mới vào danh sách state
        setProducts([...products, response.data]);
        setMessage('Thêm sản phẩm thành công!');
      })
      .catch(error => {
        setMessage('Lỗi khi thêm sản phẩm');
        console.error(error);
      });
  };

  // 3. Xử lý xóa sản phẩm (DELETE)
  const handleDeleteProduct = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      productService.deleteProduct(id)
        .then(() => {
          // Lọc sản phẩm bị xóa ra khỏi danh sách
          setProducts(products.filter(p => p.id !== id));
          setMessage('Xóa sản phẩm thành công!');
        })
        .catch(error => {
          setMessage('Lỗi khi xóa sản phẩm');
          console.error(error);
        });
    }
  };
  
  // 4. Xử lý sửa sản phẩm (UPDATE) - (Placeholder cho E2E test)
  const handleEditProduct = (product) => {
    // Logic này sẽ phức tạp hơn, thường là mở form ở chế độ edit
    // Tạm thời, chúng ta sẽ log ra để chuẩn bị cho test
    console.log('Chuẩn bị sửa:', product);
    alert(`Chức năng Sửa cho sản phẩm: ${product.name} (chưa cài đặt)`);
  };


  return (
    <div className="App">
      <header>
        <h1>Quản lý Sản phẩm (Flogin)</h1>
      </header>
      <main>
        {/* Hiển thị thông báo (ví dụ: "Thêm thành công") */}
        {message && <div data-testid="success-message" className="message">{message}</div>}

        {/* Form thêm sản phẩm (Yêu cầu 4.2.1b) */}
        <ProductForm onSubmit={handleAddProduct} />

        {/* Danh sách sản phẩm (Yêu cầu 4.2.1a) */}
        <h2>Danh sách Sản phẩm</h2>
        <ProductList 
          products={products} 
          onEdit={handleEditProduct} 
          onDelete={handleDeleteProduct} 
        />
      </main>
    </div>
  );
}

export default App;