// File: frontend/cypress/e2e/product.cy.js
// Đây là kịch bản test E2E cho Câu 6.2.2

// 1. Import Page Object Model bạn đã tạo
import productPage from './pages/ProductPage';

describe('Product E2E Tests (Req 6.2.2)', () => {

  // Chạy trước mỗi kịch bản "it(...)"
  beforeEach(() => {
    // 2. Đăng nhập trước (Giả sử bạn có custom command, nếu không, chúng ta sẽ login thủ công)
    // Vì chúng ta chưa setup custom command, hãy login thủ công
    cy.visit('/'); // Truy cập trang Login (trang gốc)
    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="password-input"]').type('Test123');
    cy.get('[data-testid="login-button"]').click();
    
    // Chờ cho trang /products load xong
    cy.url().should('include', '/products');
  });

  // Yêu cầu 6.2.2a: Test Create product
  it('Nên tạo sản phẩm mới thành công', () => {
    const productName = 'Laptop Test Cypress';
    
    // 3. Sử dụng các hàm từ Page Object Model
    productPage.visit(); // Mở trang /products (để đảm bảo)
    
    productPage.fillProductForm({
      name: productName,
      price: '30000',
      quantity: '10',
      category: 'E2E Test'
    });
    
    productPage.submitForm();
    
    // 4. Kiểm tra kết quả
    productPage.getMessage()
      .should('contain', 'Thêm sản phẩm thành công');
      
    productPage.getProductRow(productName)
      .should('exist');
  });

  // Yêu cầu 6.2.2d: Test Delete product
  it('Nên xóa sản phẩm thành công', () => {
    const productName = 'Sản phẩm để Xóa';

    // -- PHẦN A: Tạo sản phẩm để xóa (giống test trên) --
    productPage.visit();
    productPage.fillProductForm({
      name: productName,
      price: '100',
      quantity: '1',
      category: 'Delete Test'
    });
    productPage.submitForm();
    // Chờ nó xuất hiện
    productPage.getProductRow(productName).should('exist');

    // -- PHẦN B: Test chức năng xóa --
    
    // Mock window.confirm để tự động nhấn "OK"
    cy.on('window:confirm', () => true);
    
    productPage.clickDeleteOnProduct(productName);

    // 4. Kiểm tra kết quả
    productPage.getMessage()
      .should('contain', 'Xóa sản phẩm thành công');
      
    productPage.getProductRow(productName)
      .should('not.exist');
  });

  // Yêu cầu 6.2.2c: Test Update product (kiểm tra alert)
  it('Nên hiển thị alert khi nhấn Sửa', () => {
    // 5. Cypress có thể kiểm tra các "alert" của trình duyệt
    // Chúng ta theo dõi sự kiện "window:alert"
    const stub = cy.stub();
    cy.on('window:alert', stub);

    productPage.visit();
    
    // Click vào nút Sửa của sản phẩm đầu tiên trong bảng
    cy.get('[data-testid^="edit-btn-"]').first().click()
      .then(() => {
        // Kiểm tra xem alert đã được gọi với đúng nội dung
        expect(stub.getCall(0)).to.be.calledWithMatch('Chức năng Sửa cho sản phẩm:');
        expect(stub.getCall(0)).to.be.calledWithMatch('(chưa cài đặt)');
      });
  });
});