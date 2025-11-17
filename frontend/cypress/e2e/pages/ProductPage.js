// File: frontend/cypress/e2e/pages/ProductPage.js
// Đây là Page Object Model cho Câu 6.2.1 
/* eslint-env cypress */

class ProductPage {
  /**
   * (a) Phương thức truy cập trang
   * Ghé thăm trang /products (vì chúng ta đã đổi route) [cite: 978-981]
   */
  visit() {
    cy.visit("/products"); 
  }

  /**
   * (b) Phương thức điền form
   * Lấy các trường input bằng data-testid từ ProductForm.js
   * [cite: 986-991]
   */
  fillProductForm(product) {
    if (product.name) {
      cy.get('[data-testid="product-name"]').clear().type(product.name);
    }
    if (product.price) {
      cy.get('[data-testid="product-price"]').clear().type(product.price);
    }
    if (product.quantity) {
      cy.get('[data-testid="product-quantity"]').clear().type(product.quantity);
    }
    if (product.category) {
      cy.get('[data-testid="product-category"]').clear().type(product.category);
    }
  }

  /**
   * (c) Phương thức submit form
   * Click vào nút "Lưu".
   * [cite: 993-997]
   */
  submitForm() {
    // data-testid này lấy từ ProductForm.js
    cy.get('[data-testid="submit-button"]').click();
  }

  /**
   * (d) Phương thức lấy thông báo
   * Trả về element chứa thông báo (từ ProductPage.js)
   * [cite: 999-1003]
   */
  getMessage() {
    // data-testid này lấy từ ProductPage.js
    return cy.get('[data-testid="success-message"]');
  }

  /**
   * (e) Phương thức tìm sản phẩm trong danh sách
   * Tìm một hàng (<tr>) trong bảng có chứa tên sản phẩm.
   * [cite: 1006-1009]
   */
  getProductRow(productName) {
    // Tìm hàng <tr> có data-testid bắt đầu bằng "product-item-"
    // VÀ chứa văn bản productName
    return cy.contains(
      '[data-testid^="product-item-"]',
      productName
    );
  }

  /**
   * (f) Phương thức click nút "Xóa"
   * (Hỗ trợ cho 6.2.2d - Test Delete)
   */
  clickDeleteOnProduct(productName) {
    // Tìm hàng, sau đó tìm nút xóa BÊN TRONG hàng đó và click
    this.getProductRow(productName)
      .find('[data-testid^="delete-btn-"]')
      .click();
  }

  /**
   * (g) Phương thức click nút "Sửa"
   * (Hỗ trợ cho 6.2.2c - Test Update)
   */
  clickEditOnProduct(productName) {
    // Tìm hàng, sau đó tìm nút sửa BÊN TRONG hàng đó và click
    this.getProductRow(productName)
      .find('[data-testid^="edit-btn-"]')
      .click();
  }
}

export default new ProductPage(); // Xuất ra một instance để dùng ngay