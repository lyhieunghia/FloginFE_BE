class ProductPage {
    visit() {
        cy.visit('/products');
    }

    fillProductForm(product) {
        cy.get('[data-testid="product-name"]').type(product.name);
        cy.get('[data-testid="product-price"]').type(product.price);
        cy.get('[data-testid="product-quantity"]').type(product.quantity);
        cy.get('[data-testid="product-category"]').type(product.category);
    }

    submitProductForm() {
        cy.get('[data-testid="submit-button"]').click();
    }

    getSuccessMessage() {
        return cy.get('[data-testid="success-message"]');
    }

    getProductInList(name) {
        return cy.contains('[data-testid^="product-item"]', name);
    }
}
export default ProductPage;