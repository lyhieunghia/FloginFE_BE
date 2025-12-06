import ProductPage from "../support/page/ProductPage";

// Persist products across all tests in this suite
let products = [];

describe('Product E2E Tests', () => {
    const productPage = new ProductPage();

    before(() => {
        // Reset products at the start of the test suite
        products = [];
    });

    beforeEach(() => {
        // Mock GET /api/products - return current products array directly
        cy.intercept('GET', '**/api/products', (req) => {
            req.reply({
                statusCode: 200,
                body: products
            });
        }).as('getProducts');
        
        // Mock POST /api/products - add new product
        cy.intercept('POST', '**/api/products', (req) => {
            const newProduct = {
                id: products.length + 1,
                ...req.body
            };
            products.push(newProduct);
            req.reply({
                statusCode: 201,
                body: newProduct
            });
        }).as('createProduct');
        
        // Mock PUT /api/products/:id - update product
        cy.intercept('PUT', '**/api/products/*', (req) => {
            const id = parseInt(req.url.split('/').pop());
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...req.body };
                req.reply({
                    statusCode: 200,
                    body: products[index]
                });
            }
        }).as('updateProduct');
        
        // Mock DELETE /api/products/:id - delete product
        cy.intercept('DELETE', '**/api/products/*', (req) => {
            const id = parseInt(req.url.split('/').pop());
            products = products.filter(p => p.id !== id);
            req.reply({
                statusCode: 204,
                body: null
            });
        }).as('deleteProduct');
        
        productPage.visit();
    })

    it('TC1: Nên tạo sản phẩm thành công', () => {
        productPage.fillProductForm({
            name: 'Laptop Dell',
            price: 10000000,
            quantity: 10,
            category: "laptop"
        });

        productPage.submitProductForm();
        
        cy.wait('@createProduct')
            .its('response.statusCode')
            .should('be.oneOf', [200, 201]);
        
        // Wait for products to reload after creation
        cy.wait('@getProducts');
        
        productPage.getSuccessMessage()
            .should('contain', 'Thêm sản phẩm thành công');

        productPage.getProductInList('Laptop Dell')
            .should('exist');
    });

    it('TC2: Nên hiển thị form sửa sản phẩm', () => {
        // Ensure product exists first
        cy.wait('@getProducts');
        
        productPage.getProductInList('Laptop Dell')
            .find('[data-testid^="edit-btn"]')
            .click({ force: true });
        
        cy.get('[data-testid="submit-button"]')
            .should('contain', 'Cập nhật');
        cy.get('[data-testid="cancel-edit-button"]')
            .should('be.visible');
    });

    it('TC3: Nên sửa sản phẩm thành công', () => {
        // Ensure product exists first
        cy.wait('@getProducts');
        
        productPage.getProductInList('Laptop Dell')
            .find('[data-testid^="edit-btn"]')
            .click({ force: true });
            
        cy.get('[data-testid="product-price"]')
            .clear()
            .type('14000000');

        productPage.submitProductForm();
        
        cy.wait('@updateProduct')
            .its('response.statusCode')
            .should('eq', 200);
        
        // Wait for products to reload after update
        cy.wait('@getProducts');

        productPage.getProductInList('Laptop Dell')
            .children().eq(1)
            .should('contain', '14,000,000');
    });

    it('TC4: Nên xóa sản phẩm thành công', () => {
        // Ensure product exists first
        cy.wait('@getProducts');
        
        cy.on('window:confirm', (text) => {
            expect(text).to.equal('Bạn có chắc muốn xóa sản phẩm này?');
            return true; 
        });

        productPage.getProductInList('Laptop Dell')
            .find('[data-testid^="delete-btn"]')
            .click({ force: true });
        
        cy.wait('@deleteProduct')
            .its('response.statusCode')
            .should('eq', 204);
        
        // Wait for products to reload after deletion
        cy.wait('@getProducts');

        productPage.getProductInList('Laptop Dell')
            .should('not.exist');
    });
});