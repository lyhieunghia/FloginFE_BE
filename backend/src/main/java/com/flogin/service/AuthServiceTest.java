package com.flogin.service;

import com.flogin.service.AuthService;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.AuthResult;

@DisplayName("Login Service Unit Tests")
class AuthServiceTest{
    private AuthService authService;

    @BeforeEach
    void setUp(){
        authService = new AuthService();
    }

    @Test
    @DisplayName (" TC1 : Login thanh cong voi credentials hop le")
    void testLoginSuccess(){
        LoginRequest request = new LoginRequest ("testuser", "Test123");
        AuthResult response = authService.authenticate(request);
    }
}