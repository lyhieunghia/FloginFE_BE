package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

/**
 * Test API endpoints của Login với MockMvc
 * Bao gồm:
 * a) Test POST /api/auth/login endpoint (3 điểm)
 * b) Test response structure và status codes (1 điểm)
 * c) Test CORS và headers (1 điểm)
 */
@WebMvcTest(controllers = AuthController.class)
@ContextConfiguration(classes = {AuthController.class, AuthControllerTest.TestConfig.class})
@DisplayName("Auth Controller API Tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    private LoginRequest validRequest;
    private LoginResponse successResponse;
    private LoginResponse failureResponse;

    @BeforeEach
    void setup() {
        // Chuẩn bị test data
        validRequest = new LoginRequest("testuser", "Test123");
        successResponse = new LoginResponse(true, "login success", "sample-jwt-token");
        failureResponse = new LoginResponse(false, "username not found");
    }

    // ============================================================
    // a) Test POST /api/auth/login endpoint (3 điểm)
    // ============================================================

    /**
     * TC1: Test đăng nhập thành công
     * Expected: 200 OK với token trong response
     */
    @Test
    @DisplayName("TC1: POST /api/auth/login - Đăng nhập thành công")
    void testLoginSuccess() throws Exception {
        // Arrange
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(successResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("login success")))
                .andExpect(jsonPath("$.token", is("sample-jwt-token")))
                .andExpect(jsonPath("$.token", notNullValue()));
    }

    /**
     * TC2: Test đăng nhập thất bại - username không tồn tại
     * Expected: 401 UNAUTHORIZED
     */
    @Test
    @DisplayName("TC2: POST /api/auth/login - Username không tồn tại")
    void testLoginFailure_UsernameNotFound() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest("wronguser", "Pass123");
        LoginResponse response = new LoginResponse(false, "username not found");
        
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("username not found")))
                .andExpect(jsonPath("$.token").doesNotExist());
    }

    /**
     * TC3: Test đăng nhập thất bại - password sai
     * Expected: 401 UNAUTHORIZED
     */
    @Test
    @DisplayName("TC3: POST /api/auth/login - Password sai")
    void testLoginFailure_WrongPassword() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest("testuser", "wrongpass");
        LoginResponse response = new LoginResponse(false, "wrong password");
        
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("wrong password")));
    }

    /**
     * TC4: Test validation - Request body rỗng
     * Expected: 400 BAD REQUEST
     */
    @Test
    @DisplayName("TC4: POST /api/auth/login - Request body rỗng")
    void testLoginFailure_EmptyRequestBody() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    /**
     * TC5: Test validation - Username rỗng
     * Expected: 400 BAD REQUEST
     */
    @Test
    @DisplayName("TC5: POST /api/auth/login - Username rỗng")
    void testLoginFailure_BlankUsername() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest("", "Pass123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    /**
     * TC6: Test validation - Password rỗng
     * Expected: 400 BAD REQUEST
     */
    @Test
    @DisplayName("TC6: POST /api/auth/login - Password rỗng")
    void testLoginFailure_BlankPassword() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest("testuser", "");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // ============================================================
    // b) Test response structure và status codes (1 điểm)
    // ============================================================

    /**
     * TC7: Test response structure - Success case
     * Kiểm tra cấu trúc JSON response khi đăng nhập thành công
     */
    @Test
    @DisplayName("TC7: Kiểm tra cấu trúc response khi thành công")
    void testResponseStructure_Success() throws Exception {
        // Arrange
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(successResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isMap())
                .andExpect(jsonPath("$.success").exists())
                .andExpect(jsonPath("$.success").isBoolean())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.message").isString())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").isString());
    }

    /**
     * TC8: Test response structure - Failure case
     * Kiểm tra cấu trúc JSON response khi đăng nhập thất bại
     */
    @Test
    @DisplayName("TC8: Kiểm tra cấu trúc response khi thất bại")
    void testResponseStructure_Failure() throws Exception {
        // Arrange
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(failureResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isMap())
                .andExpect(jsonPath("$.success").exists())
                .andExpect(jsonPath("$.success").isBoolean())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.message").isString());
    }

    /**
     * TC9: Test status codes - Các HTTP status codes
     */
    @Test
    @DisplayName("TC9: Kiểm tra HTTP status codes")
    void testStatusCodes() throws Exception {
        // Test 200 OK
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(successResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(status().is(200));

        // Test 401 UNAUTHORIZED
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(failureResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(status().is(401));
    }

    // ============================================================
    // c) Test CORS và headers (1 điểm)
    // ============================================================

    /**
     * TC10: Test CORS headers
     * Kiểm tra CORS được cấu hình đúng
     */
    @Test
    @DisplayName("TC10: Kiểm tra CORS headers")
    void testCorsHeaders() throws Exception {
        // Arrange
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(successResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest))
                        .header("Origin", "https://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }

    /**
     * TC11: Test CORS preflight request (OPTIONS)
     * Kiểm tra preflight request
     */
    @Test
    @DisplayName("TC11: Kiểm tra CORS preflight (OPTIONS)")
    void testCorsPreflightRequest() throws Exception {
        // Act & Assert
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .options("/api/auth/login")
                        .header("Origin", "https://localhost:3000")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "Content-Type"))
                .andExpect(status().isOk());
    }

    /**
     * TC12: Test custom headers trong response
     * Kiểm tra X-Auth-Token header khi login thành công
     */
    @Test
    @DisplayName("TC12: Kiểm tra custom headers (X-Auth-Token)")
    void testCustomHeaders() throws Exception {
        // Arrange
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(successResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(header().exists("X-Auth-Token"))
                .andExpect(header().string("X-Auth-Token", "sample-jwt-token"));
    }

    /**
     * TC13: Test Content-Type header
     * Kiểm tra Accept và Content-Type headers
     */
    @Test
    @DisplayName("TC13: Kiểm tra Content-Type headers")
    void testContentTypeHeaders() throws Exception {
        // Arrange
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(successResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(header().string("Content-Type", containsString("application/json")));
    }

    /**
     * TC14: Test request với Content-Type không hợp lệ
     * Expected: 415 UNSUPPORTED MEDIA TYPE
     */
    @Test
    @DisplayName("TC14: Kiểm tra request với Content-Type không hợp lệ")
    void testUnsupportedContentType() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("username=test&password=123"))
                .andExpect(status().isUnsupportedMediaType());
    }

    /**
     * TC15: Test endpoint không tồn tại
     * Expected: 404 NOT FOUND
     */
    @Test
    @DisplayName("TC15: Kiểm tra endpoint không tồn tại")
    void testEndpointNotFound() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/invalid")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isNotFound());
    }

    /**
     * Configuration class để test không cần Spring Boot Application
     */
    @Configuration
    @EnableWebSecurity
    static class TestConfig {
        
        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }
}
