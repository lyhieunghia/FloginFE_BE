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

    it("TC4: Username rỗng trả về lỗi", () => {
        cy.get('[data-testid="username-input"]').clear();
        cy.get('[data-testid="password-input"]').clear().type("ValidPass123");
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="username-error"]').should('be.visible')
          .and('contain', 'Username không được để trống');
    });

    it("TC5: Username quá ngắn trả về lỗi", () => {
        cy.get('[data-testid="username-input"]').clear().type("ab");
        cy.get('[data-testid="password-input"]').clear().type("ValidPass123");
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="username-error"]').should('be.visible')
          .and('contain', 'Username phải có ít nhất 3 ký tự');
    });

    it("TC6: Username quá dài trả về lỗi", () => {
        cy.get('[data-testid="username-input"]').clear().type("thisisaverylongusername");
        cy.get('[data-testid="password-input"]').clear().type("ValidPass123");
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="username-error"]').should('be.visible')
          .and('contain', 'Username không được vượt quá 16 ký tự');
    });

    it("TC7: Username chứa khoảng trắng trả về lỗi", () => {
        cy.get('[data-testid="username-input"]').clear().type("invalid user");
        cy.get('[data-testid="password-input"]').clear().type("ValidPass123");
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="username-error"]').should('be.visible')
          .and('contain', 'Username không được chứa khoảng trắng');
    });

    it("TC8: Username chứa ký tự đặc biệt trả về lỗi", () => {
        cy.get('[data-testid="username-input"]').clear().type("invalid#$%^<>");
        cy.get('[data-testid="password-input"]').clear().type("ValidPass123");
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="username-error"]').should('be.visible')
          .and('contain', 'Username không được chứa kí tự đặc biệt');
    });

    it("TC9: Password rỗng trả về lỗi", () => {
        cy.get('[data-testid="username-input"]').clear().type("validUser");
        cy.get('[data-testid="password-input"]').clear();
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="password-error"]').should('be.visible')
          .and('contain', 'Password không được để trống');
    });

    it("TC10: Password quá ngắn trả về lỗi", () => {
        cy.get('[data-testid="username-input"]').clear().type("validUser");
        cy.get('[data-testid="password-input"]').clear().type("123");
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="password-error"]').should('be.visible')
           .and('contain', 'Password phải có ít nhất 6 ký tự');
    });

    it("TC11: Password không có chữ cái trả về lỗi", () => {
        cy.get('[data-testid="username-input"]').clear().type("validUser");
        cy.get('[data-testid="password-input"]').clear().type("123123");
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="password-error"]').should('be.visible')
          .and('contain', 'Password phải chứa ít nhất 1 chữ cái');
    });

    it("TC12: Password không có số trả về lỗi", () => {
        cy.get('[data-testid="username-input"]').clear().type("validUser");
        cy.get('[data-testid="password-input"]').clear().type("abcdefgh");
        cy.get('[data-testid="login-button"]').click();

        cy.get('[data-testid="password-error"]').should('be.visible')
            .and('contain', 'Password phải chứa ít nhất 1 chữ số');
    });

});