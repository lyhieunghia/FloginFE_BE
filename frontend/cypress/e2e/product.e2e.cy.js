import ProductPage from "../support/page/ProductPage";

describe('Product E2E Tests', () => {
    const productPage = new ProductPage();

    beforeEach(() => {
        cy.login('testuser', 'Test123');
        productPage.visit();
    });

    it('TC1: Nên tạo sản phẩm thành công', () => {
        productPage.fillProductForm({
            name: 'Laptop Dell',
            price: 10000000,
            quantity: 10,
            category: "laptop"
        });

        productPage.submitProductForm();
        
        productPage.getSuccessMessage()
            .should('contain', 'Thêm sản phẩm thành công');
        productPage.getProductInList('Laptop Dell')
            .should('exist');
    });

    it('TC2: Nên hiển thị form sửa sản phẩm', () => {
        productPage.getProductInList('Laptop Dell')
            .find('[data-testid^="edit-btn"]')
            .click({ force: true });
        
        cy.get('[data-testid="submit-button"]')
            .should('contain', 'Cập nhật');
        cy.get('[data-testid="cancel-edit-button"]')
            .should('be.visible');
    });

    it('TC3: Nên sửa sản phẩm thành công', () => {
        productPage.getProductInList('Laptop Dell')
            .find('[data-testid^="edit-btn"]')
            .click({ force: true });
        cy.get('[data-testid="product-price"]')
            .clear()
            .type('14000000');
        productPage.submitProductForm();

        productPage.getProductInList('Laptop Dell')
            .children().eq(1)
            .should('contain', '14,000,000');
    });

    it('TC4: Nên xóa sản phẩm thành công', () => {
        cy.on('window:confirm', (text) => {
            expect(text).to.equal('Bạn có chắc muốn xóa sản phẩm này?');
            return true; 
        });

        productPage.getProductInList('Laptop Dell')
            .find('[data-testid^="delete-btn"]')
            .click({force: true});
        
        productPage.getProductInList('Laptop Dell')
            .should('not.exist');

    });
});