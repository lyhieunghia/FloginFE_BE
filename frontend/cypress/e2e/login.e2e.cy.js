describe ('Login E2E Tests', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('TC1: Nên hiển thị form login', () => {
        cy.get('[data-testid="username-input"]').should('be.visible');
        cy.get('[data-testid="password-input"]').should('be.visible');
        cy.get('[data-testid="login-button"]').should('be.visible');
    });

    it('TC2: Đăng nhập thành công với thông tin hợp lệ', () => {
        cy.get('[data-testid="username-input"]').type('testuser');
        cy.get('[data-testid="password-input"]').type('Test123');
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="login-message"]').should('contain', 'Đăng nhập thành công');
        cy.url().should('contain', '/');
    });

    it('TC3: Hiển thị thông báo lỗi khi đăng nhập với username và password rỗng', () => {
        cy.get('[data-testid="username-input"]').clear();
        cy.get('[data-testid="password-input"]').clear();
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="login-message"]').should('contain', 'Đăng nhập thất bại');
        cy.get('[data-testid="username-error"]').should('be.visible');
        cy.get('[data-testid="password-error"]').should('be.visible');
    });

    it('TC4: Hiển thị thông báo lỗi khi đăng nhập với credentials không hợp lệ', () => {
        cy.get('[data-testid="username-input"]').type('Averylongusername123');
        cy.get('[data-testid="password-input"]').type('123');
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="login-message"]').should('contain', 'Đăng nhập thất bại');
        cy.get('[data-testid="username-error"]').should('be.visible');
        cy.get('[data-testid="password-error"]').should('be.visible');
    });
});