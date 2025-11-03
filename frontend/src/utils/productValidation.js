export const validateProduct = (product) => {
  const errors = {};

  // 1. Product Name
  if (!product.name || product.name.trim() === "") {
    errors.name = "Tên sản phẩm không được để trống";
  } else if (product.name.length < 3) {
    errors.name = "Tên sản phẩm phải có ít nhất 3 ký tự";
  } else if (product.name.length > 100) {
    errors.name = "Tên sản phẩm không được vượt quá 100 ký tự";
  }

  // 2. Price
  const priceNum = Number(product.price);
  if (
    product.price === undefined ||
    product.price === null ||
    product.price === ""
  ) {
    errors.price = "Giá sản phẩm không được để trống";
  } else if (isNaN(priceNum)) {
    errors.price = "Giá sản phẩm phải là một con số";
  } else if (priceNum <= 0) {
    // Thêm điều kiện > 0 dựa trên ví dụ test TC2
    errors.price = "Giá sản phẩm phải lớn hơn 0";
  } else if (priceNum > 999999999) {
    errors.price = "Giá sản phẩm không được vượt quá 999,999,999";
  }

  // 3. Quantity
  const quantityNum = Number(product.quantity);
  if (
    product.quantity === undefined ||
    product.quantity === null ||
    product.quantity === ""
  ) {
    errors.quantity = "Số lượng không được để trống";
  } else if (isNaN(quantityNum)) {
    errors.quantity = "Số lượng phải là một con số";
  } else if (!Number.isInteger(quantityNum)) {
    errors.quantity = "Số lượng phải là số nguyên";
  } else if (quantityNum < 0) {
    errors.quantity = "Số lượng không được nhỏ hơn 0";
  } else if (quantityNum > 99999) {
    errors.quantity = "Số lượng không được vượt quá 99,999";
  }

  // 4. Description
  if (product.description && product.description.length > 500) {
    errors.description = "Mô tả không được vượt quá 500 ký tự";
  }

  // 5. Category
  if (!product.category || product.category.trim() === "") {
    errors.category = "Danh mục không được để trống";
  }

  return errors;
};
