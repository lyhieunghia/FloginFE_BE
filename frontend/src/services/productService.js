import axios from 'axios';

// URL cơ sở của backend
const API_URL = 'http://localhost:8080/api/products';

/**
 * Lấy danh sách tất cả sản phẩm
 * (Yêu cầu cho test 4.2.1a )
 */
export const getAllProducts = () => {
  // return axios.get(API_URL);
  
  // ----- DỮ LIỆU GIẢ (Mock) BỎ QUA API -----
  // Tạm thời trả về dữ liệu giả để test UI
  console.log('productService: Đang gọi API (giả) - getAllProducts');
  return Promise.resolve({
    data: [
      { id: 1, name: 'Sản phẩm Mẫu 1', price: 100000, quantity: 10 },
      { id: 2, name: 'Sản phẩm Mẫu 2', price: 250000, quantity: 5 },
    ],
  });
  // ----------------------------------------
};

/**
 * Tạo sản phẩm mới
 * (Yêu cầu cho test 4.2.1b )
 */
export const createProduct = (product) => {
  // return axios.post(API_URL, product);
  
  // ----- DỮ LIỆU GIẢ (Mock) BỎ QUA API -----
  console.log('productService: Đang gọi API (giả) - createProduct', product);
  const newId = Math.floor(Math.random() * 1000);
  return Promise.resolve({
    data: { ...product, id: newId },
  });
  // ----------------------------------------
};

/**
 * Xóa sản phẩm
 * (Yêu cầu cho test 6.2.2d )
 */
export const deleteProduct = (id) => {
  // return axios.delete(`${API_URL}/${id}`);
  
  // ----- DỮ LIỆU GIẢ (Mock) BỎ QUA API -----
  console.log('productService: Đang gọi API (giả) - deleteProduct', id);
  return Promise.resolve();
  // ----------------------------------------
};
