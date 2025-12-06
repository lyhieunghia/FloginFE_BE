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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

/**
 * Test API endpoints của Login với MockMvc
 * Test CORS và headers (KHÔNG cần Spring Security)
 */
@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Auth Controller API Tests - CORS & Headers")
@org.springframework.test.context.ActiveProfiles("test")
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
        validRequest = new LoginRequest("testuser", "Test123");
        successResponse = new LoginResponse(true, "login success", "sample-jwt-token");
        failureResponse = new LoginResponse(false, "username not found");
    }

    // ============================================================
    // Test POST /api/auth/login endpoint
    // ============================================================

    @Test
    @DisplayName("TC1: POST /api/auth/login - Đăng nhập thành công")
    void testLoginSuccess() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(successResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("login success")))
                .andExpect(jsonPath("$.token", is("sample-jwt-token")))
                .andExpect(jsonPath("$.token", notNullValue()));
    }

    @Test
    @DisplayName("TC2: POST /api/auth/login - Username không tồn tại")
    void testLoginFailure_UsernameNotFound() throws Exception {
        LoginRequest request = new LoginRequest("wronguser", "Pass123");
        LoginResponse response = new LoginResponse(false, "username not found");
        
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("username not found")))
                .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    @DisplayName("TC3: POST /api/auth/login - Password sai")
    void testLoginFailure_WrongPassword() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "wrongpass");
        LoginResponse response = new LoginResponse(false, "wrong password");
        
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("wrong password")));
    }

    @Test
    @DisplayName("TC4: POST /api/auth/login - Request body rỗng")
    void testLoginFailure_EmptyRequestBody() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    // ============================================================
    // Test response structure và status codes
    // ============================================================

    @Test
    @DisplayName("TC5: Kiểm tra cấu trúc response khi thành công")
    void testResponseStructure_Success() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(successResponse);

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

    @Test
    @DisplayName("TC6: Kiểm tra cấu trúc response khi thất bại")
    void testResponseStructure_Failure() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(failureResponse);

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

    // ============================================================
    // Test CORS và headers (KHÔNG CẦN Spring Security!)
    // ============================================================

    @Test
    @DisplayName("TC7: Kiểm tra CORS headers - Access-Control-Allow-Origin")
    void testCorsHeaders() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(successResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest))
                        .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"))
                .andExpect(header().string("Access-Control-Allow-Origin", "*"));
    }

    @Test
    @DisplayName("TC8: Kiểm tra CORS preflight request (OPTIONS)")
    void testCorsPreflightRequest() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                        .header("Origin", "http://localhost:3000")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"))
                .andExpect(header().exists("Access-Control-Allow-Methods"));
    }

    @Test
    @DisplayName("TC9: Kiểm tra Content-Type header")
    void testContentTypeHeaders() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(successResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(header().string("Content-Type", containsString("application/json")));
    }

    @Test
    @DisplayName("TC10: Kiểm tra request với Content-Type không hợp lệ")
    void testUnsupportedContentType() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("username=test&password=123"))
                .andExpect(status().isUnsupportedMediaType());
    }

    @Test
    @DisplayName("TC11: Kiểm tra HTTP status codes")
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

    @Test
    @DisplayName("TC12: Kiểm tra CORS với nhiều origins")
    void testCorsMultipleOrigins() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(successResponse);

        // Test với origin khác
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest))
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }

    @Test
    @DisplayName("TC13: Kiểm tra endpoint không tồn tại")
    void testEndpointNotFound() throws Exception {
        mockMvc.perform(post("/api/auth/invalid")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("TC14: Kiểm tra CORS headers có đầy đủ")
    void testCorsHeadersComplete() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(successResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest))
                        .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"))
                // Các CORS headers khác sẽ xuất hiện trong preflight
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}

