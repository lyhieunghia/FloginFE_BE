describe('Test common vulnerabilities', () => {    
  it("TC1: Username chứa XSS payload trả về lỗi", () => {
    cy.visit('/login');
    cy.get('[data-testid="username-input"]').clear().type("<script>alert('XSS')</script>");
    cy.get('[data-testid="password-input"]').clear().type("ValidPass123");
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="login-message"]').should('not.contain.html', '<script>');
    cy.get('[data-testid="username-error"]').should('be.visible');
  });

  it("TC2: Username chứa SQLInjection payload trả về lỗi", () => {
    cy.visit('/login');
    cy.get('[data-testid="username-input"]').clear().type("' OR '1'='1");
    cy.get('[data-testid="password-input"]').clear().type("ValidPass123");
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="login-message"]').should('not.contain.html', '<script>');
    cy.get('[data-testid="username-error"]').should('be.visible');
  });

  it("TC3: Truy cập api thiếu token trả về lỗi", () => {
    // Gửi request trực tiếp (không token)
    cy.request({
        method: "GET",
        url: "/api/products",
        failOnStatusCode: false // để không bị Cypress chặn 401
    }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.contain("Unauthorized");
    });
    cy.visit('/login');
    cy.get('[data-testid="username-input"]').clear().type("<script>alert('XSS')</script>");
    cy.get('[data-testid="password-input"]').clear().type("ValidPass123");
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="login-message"]').should('not.contain.html', '<script>');
    cy.get('[data-testid="username-error"]').should('be.visible');
  });

  it("TC4: POST product thiếu CSRF trả về lỗi", () => {
    cy.request({
        method: "POST",
        url: "/api/products",
        failOnStatusCode: false, // Cho phép nhận 403
        body: {
            name: "Hacker Product",
            price: 999,
            stock: 10
        },
        headers: {
            // Cố ý không gửi CSRF token
            "X-CSRF-TOKEN": ""
        }
    }).then((res) => {
        expect(res.status).to.eq(403);
        expect(res.body.message).to.contain("Invalid CSRF Token");
    });
    cy.visit('/login');
    cy.get('[data-testid="username-input"]').clear().type("<script>alert('XSS')</script>");
    cy.get('[data-testid="password-input"]').clear().type("ValidPass123");
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="login-message"]').should('not.contain.html', '<script>');
    cy.get('[data-testid="username-error"]').should('be.visible');
  });
});