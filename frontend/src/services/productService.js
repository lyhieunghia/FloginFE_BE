import api from "./api";

export const getAllProducts = async() => {
  return await api.get(`/products`);
};

export const getProductById = async(id) => {
  return await api.get(`/products/${id}`);
};

export const createProduct = async(product) => {
  return await api.post(`/products`, product);
};

export const updateProduct = async(id, product) => {
  return await api.put(`/products/${id}`, product);
};

export const deleteProduct = async(id) => {
  return await api.delete(`/products/${id}`);
};