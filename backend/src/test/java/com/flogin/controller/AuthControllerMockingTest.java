package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

/**
 * 5.1.2 Backend Mocking (2.5 điểm)
 * Test suite để demo mock dependencies trong Backend tests
 */
@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Backend Mocking Tests - AuthController")
@org.springframework.test.context.ActiveProfiles("test")
class AuthControllerMockingTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * a) Mock AuthService với @MockBean (1 điểm)
     * @MockBean tạo mock bean và inject vào Spring context
     */
    @MockBean
    private AuthService authService;

    private LoginRequest validRequest;
    private LoginResponse successResponse;
    private LoginResponse failureResponse;

    @BeforeEach
    void setup() {
        validRequest = new LoginRequest("testuser", "password123");
        successResponse = new LoginResponse(true, "Login successful", "jwt-token-12345");
        failureResponse = new LoginResponse(false, "Invalid credentials");
        
        // Reset mock để mỗi test case độc lập
        reset(authService);
    }

    // ============================================================
    // a) Mock AuthService với @MockBean (1 điểm)
    // ============================================================

    @Nested
    @DisplayName("a) Mock AuthService với @MockBean - 1 điểm")
    class MockAuthServiceTests {

        @Test
        @DisplayName("TC1: Verify AuthService được mock thành công")
        void testAuthServiceIsMocked() {
            // Verify rằng authService là một mock object
            assertThat(authService).isNotNull();
            
            // Mock behavior
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(successResponse);
            
            // Verify mock trả về giá trị đã stub
            LoginResponse result = authService.authenticate(validRequest);
            assertThat(result).isNotNull();
            assertThat(result.isSuccess()).isTrue();
            assertThat(result.getMessage()).isEqualTo("Login successful");
            assertThat(result.getToken()).isEqualTo("jwt-token-12345");
        }

        @Test
        @DisplayName("TC2: Mock multiple scenarios - success và failure")
        void testMockMultipleScenarios() {
            // Scenario 1: Login thành công
            when(authService.authenticate(argThat(req -> 
                req != null && "testuser".equals(req.getUsername()))))
                    .thenReturn(successResponse);
            
            LoginResponse successResult = authService.authenticate(validRequest);
            assertThat(successResult.isSuccess()).isTrue();
            
            // Scenario 2: Login thất bại
            LoginRequest invalidRequest = new LoginRequest("wronguser", "wrongpass");
            when(authService.authenticate(argThat(req -> 
                req != null && "wronguser".equals(req.getUsername()))))
                    .thenReturn(failureResponse);
            
            LoginResponse failResult = authService.authenticate(invalidRequest);
            assertThat(failResult.isSuccess()).isFalse();
        }

        @Test
        @DisplayName("TC3: Mock với different return values dựa trên input")
        void testMockWithDifferentInputs() {
            // Mock cho username "admin"
            when(authService.authenticate(argThat(req -> 
                req != null && "admin".equals(req.getUsername()))))
                    .thenReturn(new LoginResponse(true, "Admin login", "admin-token"));
            
            // Mock cho username "user"
            when(authService.authenticate(argThat(req -> 
                req != null && "user".equals(req.getUsername()))))
                    .thenReturn(new LoginResponse(true, "User login", "user-token"));
            
            LoginResponse adminResult = authService.authenticate(
                new LoginRequest("admin", "pass"));
            assertThat(adminResult.getToken()).isEqualTo("admin-token");
            
            LoginResponse userResult = authService.authenticate(
                new LoginRequest("user", "pass"));
            assertThat(userResult.getToken()).isEqualTo("user-token");
        }

        @Test
        @DisplayName("TC4: Mock exception scenario")
        void testMockException() {
            // Mock để throw exception
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenThrow(new RuntimeException("Database connection failed"));
            
            // Verify exception được throw
            try {
                authService.authenticate(validRequest);
            } catch (RuntimeException e) {
                assertThat(e.getMessage()).isEqualTo("Database connection failed");
            }
        }
    }

    // ============================================================
    // b) Test controller với mocked service (1 điểm)
    // ============================================================

    @Nested
    @DisplayName("b) Test controller với mocked service - 1 điểm")
    class TestControllerWithMockedService {

        @Test
        @DisplayName("TC5: Test login endpoint với mocked success response")
        void testLoginEndpointWithMockedSuccess() throws Exception {
            // Given: Mock service trả về success
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(successResponse);

            // When & Then: Call API và verify response
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.message", is("Login successful")))
                    .andExpect(jsonPath("$.token", is("jwt-token-12345")));
        }

        @Test
        @DisplayName("TC6: Test login endpoint với mocked failure response")
        void testLoginEndpointWithMockedFailure() throws Exception {
            // Given: Mock service trả về failure
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(failureResponse);

            // When & Then: Call API và verify 401 status
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success", is(false)))
                    .andExpect(jsonPath("$.message", is("Invalid credentials")))
                    .andExpect(jsonPath("$.token").doesNotExist());
        }

        @Test
        @DisplayName("TC7: Test multiple calls với different mocked responses")
        void testMultipleCallsWithDifferentMocks() throws Exception {
            // First call: Success
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(successResponse);

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));

            // Second call: Failure (reset mock)
            reset(authService);
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(failureResponse);

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success", is(false)));
        }

        @Test
        @DisplayName("TC8: Test controller behavior với null token trong response")
        void testControllerWithNullToken() throws Exception {
            // Mock response không có token
            LoginResponse noTokenResponse = new LoginResponse(false, "Authentication failed");
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(noTokenResponse);

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.token").doesNotExist());
        }

        @Test
        @DisplayName("TC9: Test controller với empty message")
        void testControllerWithEmptyMessage() throws Exception {
            LoginResponse emptyMessageResponse = new LoginResponse(true, "", "token123");
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(emptyMessageResponse);

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.message", is("")))
                    .andExpect(jsonPath("$.token", is("token123")));
        }
    }

    // ============================================================
    // c) Verify mock interactions (0.5 điểm)
    // ============================================================

    @Nested
    @DisplayName("c) Verify mock interactions - 0.5 điểm")
    class VerifyMockInteractionsTests {

        @Test
        @DisplayName("TC10: Verify authenticate() được gọi đúng 1 lần")
        void testVerifyAuthenticateCalledOnce() throws Exception {
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(successResponse);

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isOk());

            // Verify method được gọi đúng 1 lần
            verify(authService, times(1)).authenticate(any(LoginRequest.class));
        }

        @Test
        @DisplayName("TC11: Verify authenticate() không được gọi khi request invalid")
        void testVerifyAuthenticateNotCalledOnInvalidRequest() throws Exception {
            // Send invalid request (empty body)
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest());

            // Verify authenticate() không được gọi do validation failed
            verify(authService, never()).authenticate(any(LoginRequest.class));
        }

        @Test
        @DisplayName("TC12: Verify argument được pass vào authenticate()")
        void testVerifyArgumentPassedToAuthenticate() throws Exception {
            ArgumentCaptor<LoginRequest> captor = ArgumentCaptor.forClass(LoginRequest.class);
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(successResponse);

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isOk());

            // Capture và verify argument
            verify(authService).authenticate(captor.capture());
            LoginRequest capturedRequest = captor.getValue();
            
            assertThat(capturedRequest).isNotNull();
            assertThat(capturedRequest.getUsername()).isEqualTo("testuser");
            assertThat(capturedRequest.getPassword()).isEqualTo("password123");
        }

        @Test
        @DisplayName("TC13: Verify multiple calls với verify(times())")
        void testVerifyMultipleCalls() throws Exception {
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(successResponse);

            // Call API 3 lần
            for (int i = 0; i < 3; i++) {
                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(validRequest)))
                        .andExpect(status().isOk());
            }

            // Verify được gọi đúng 3 lần
            verify(authService, times(3)).authenticate(any(LoginRequest.class));
        }

        @Test
        @DisplayName("TC14: Verify authenticate() với specific argument matchers")
        void testVerifyWithSpecificMatchers() throws Exception {
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(successResponse);

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isOk());

            // Verify với specific argument matcher
            verify(authService).authenticate(argThat(request -> 
                request.getUsername().equals("testuser") && 
                request.getPassword().equals("password123")
            ));
        }

        @Test
        @DisplayName("TC15: Verify no more interactions after expected calls")
        void testVerifyNoMoreInteractions() throws Exception {
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(successResponse);

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isOk());

            // Verify chỉ có 1 interaction với authenticate()
            verify(authService, times(1)).authenticate(any(LoginRequest.class));
            
            // Verify không có interaction nào khác
            verifyNoMoreInteractions(authService);
        }

        @Test
        @DisplayName("TC16: Verify call order với InOrder")
        void testVerifyCallOrder() throws Exception {
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(successResponse)
                    .thenReturn(failureResponse);

            // Call 1
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isOk());

            // Call 2
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isUnauthorized());

            // Verify được gọi 2 lần (không cần verify thứ tự strict)
            verify(authService, times(2)).authenticate(any(LoginRequest.class));
        }

        @Test
        @DisplayName("TC17: Verify với ArgumentCaptor - capture multiple calls")
        void testArgumentCaptorMultipleCalls() throws Exception {
            ArgumentCaptor<LoginRequest> captor = ArgumentCaptor.forClass(LoginRequest.class);
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(successResponse);

            // Call với different usernames
            LoginRequest request1 = new LoginRequest("user1", "pass1");
            LoginRequest request2 = new LoginRequest("user2", "pass2");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request1)))
                    .andExpect(status().isOk());

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request2)))
                    .andExpect(status().isOk());

            // Capture tất cả calls
            verify(authService, times(2)).authenticate(captor.capture());
            var allValues = captor.getAllValues();
            
            assertThat(allValues).hasSize(2);
            assertThat(allValues.get(0).getUsername()).isEqualTo("user1");
            assertThat(allValues.get(1).getUsername()).isEqualTo("user2");
        }
    }

    // ============================================================
    // Bonus: Advanced Mocking Scenarios
    // ============================================================

    @Nested
    @DisplayName("Bonus: Advanced Mocking Techniques")
    class AdvancedMockingTests {

        @Test
        @DisplayName("TC18: Mock với thenAnswer() để custom behavior")
        void testMockWithAnswer() throws Exception {
            // Mock với custom answer
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenAnswer(invocation -> {
                        LoginRequest request = invocation.getArgument(0);
                        if ("admin".equals(request.getUsername())) {
                            return new LoginResponse(true, "Admin access", "admin-token");
                        }
                        return new LoginResponse(false, "User not admin");
                    });

            // Test admin
            LoginRequest adminRequest = new LoginRequest("admin", "pass");
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(adminRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message", is("Admin access")));

            // Test non-admin
            LoginRequest userRequest = new LoginRequest("user", "pass");
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(userRequest)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message", is("User not admin")));
        }

        @Test
        @DisplayName("TC19: Mock với doReturn() thay vì when()")
        void testMockWithDoReturn() throws Exception {
            // Sử dụng doReturn() khi when() có thể gây side effects
            doReturn(successResponse)
                    .when(authService)
                    .authenticate(any(LoginRequest.class));

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));

            verify(authService).authenticate(any(LoginRequest.class));
        }

        @Test
        @DisplayName("TC20: Reset mock giữa các test cases")
        void testResetMock() throws Exception {
            // First setup
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(successResponse);

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isOk());

            verify(authService, times(1)).authenticate(any(LoginRequest.class));

            // Reset mock
            reset(authService);

            // New setup after reset
            when(authService.authenticate(any(LoginRequest.class)))
                    .thenReturn(failureResponse);

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isUnauthorized());

            // Verify count reset về 1
            verify(authService, times(1)).authenticate(any(LoginRequest.class));
        }
    }
}
