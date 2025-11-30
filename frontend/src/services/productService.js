import axios from 'axios';

// URL Spring Boot backend của bạn 
const API_URL = 'http://localhost:8080/api/products';

/**
 * Lấy danh sách tất cả sản phẩm
 * (Yêu cầu cho test 4.2.1a )
 */
export const getAllProducts = () => {
  return axios.get(API_URL);
};

/**
 * Lấy chi tiết một sản phẩm
 * (Yêu cầu cho test 4.2.1c )
 */
export const getProductById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

/**
 * Tạo sản phẩm mới
 * (Yêu cầu cho test 4.2.1b )
 */
export const createProduct = (product) => {
  return axios.post(API_URL, product);
};

/**
 * Cập nhật sản phẩm
 * (Yêu cầu cho test 6.2.2c )
 */
export const updateProduct = (id, product) => {
  return axios.put(`${API_URL}/${id}`, product);
};

/**
 * Xóa sản phẩm
 * (Yêu cầu cho test 6.2.2d )
 */
export const deleteProduct = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};