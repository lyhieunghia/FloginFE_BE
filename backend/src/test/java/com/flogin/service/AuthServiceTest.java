package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.UserEntity;
import com.flogin.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

// Import các hàm static của Mockito và AssertJ/JUnit để code gọn hơn
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit Tests cho AuthService
 * Coverage target: >= 85%
 * 
 * Test scenarios:
 * a) authenticate() method (3 điểm):
 *    - Login thành công
 *    - Login với username không tồn tại
 *    - Login với password sai
 *    - Validation errors
 * b) Validation methods riêng lẻ (1 điểm)
 * c) Coverage >= 85% (1 điểm)
 */
@ActiveProfiles("test")
@DisplayName("Login Service Unit Tests")
class AuthServiceTest {

    // 1. Giả lập (Mock) các dependency mà AuthService cần
    @Mock
    private UserRepository mockUserRepository; // Giả lập kho user

    @Mock
    private PasswordService mockPasswordService; // Giả lập bộ so khớp mật khẩu

    @Mock
    private JwtUtil mockJwtUtil; // Giả lập JWT utility

    // 2. Tự động "tiêm" các mock ở trên vào authService
    @InjectMocks
    private AuthService authService; // Đây là class chúng ta cần test

    // 3. Chuẩn bị dữ liệu (User "tạo trước")
    private UserEntity existingUser;
    private LoginRequest successRequest;

    @BeforeEach
    void setup() {
        // Khởi tạo các @Mock và @InjectMocks
        MockitoAnnotations.openMocks(this);

        // Đây chính là phần "tạo trước user" của bạn
        // Chúng ta tạo một UserEntity mẫu
        existingUser = new UserEntity();
        existingUser.setId(1L);
        existingUser.setUsername("testuser");
        existingUser.setPassword("encodedPassword123"); // Mật khẩu đã mã hóa

        // Dữ liệu mẫu cho request đăng nhập thành công
        successRequest = new LoginRequest("testuser", "Test123");
    }

    // ============================================================
    // a) Test method authenticate() với các scenarios (3 điểm)
    // ============================================================

    @Nested
    @DisplayName("a) Test authenticate() method - 3 điểm")
    class AuthenticateMethodTests {

        /**
         * Test kịch bản: Đăng nhập thành công
         */
        @Test
        @DisplayName("TC1: Đăng nhập thành công với credentials hợp lệ")
        void testLoginSuccess() {
            // Arrange - Sắp đặt
            // 1. Khi ai đó gọi findByUsername("testuser"), hãy trả về user "tạo trước"
            when(mockUserRepository.findByUsername("testuser"))
                    .thenReturn(Optional.of(existingUser));

            // 2. Khi ai đó so khớp "Test123" với "encodedPassword123", hãy trả về true
            when(mockPasswordService.matches("Test123", "encodedPassword123"))
                    .thenReturn(true);

            // 3. Mock JWT token generation
            when(mockJwtUtil.generateToken(existingUser))
                    .thenReturn("sample-jwt-token");

            // Act - Thực thi
            LoginResponse response = authService.authenticate(successRequest);

            // Assert - Kiểm tra
            assertTrue(response.isSuccess());
            assertEquals("login success", response.getMessage());
            assertNotNull(response.getToken());
            assertEquals("sample-jwt-token", response.getToken());

            // Verify mock interactions
            verify(mockUserRepository, times(1)).findByUsername("testuser");
            verify(mockPasswordService, times(1)).matches("Test123", "encodedPassword123");
            verify(mockJwtUtil, times(1)).generateToken(existingUser);
        }

        /**
         * Test kịch bản: Login với username không tồn tại
         */
        @Test
        @DisplayName("TC2: Login thất bại với username không tồn tại")
        void testLoginFailureWrongUsername() {
            // Arrange
            LoginRequest request = new LoginRequest("wronguser", "Pass123");

            // 1. Khi ai đó gọi findByUsername("wronguser"), hãy trả về rỗng
            when(mockUserRepository.findByUsername("wronguser"))
                    .thenReturn(Optional.empty());

            // Act
            LoginResponse response = authService.authenticate(request);

            // Assert
            assertFalse(response.isSuccess());
            assertEquals("username not found", response.getMessage());
            assertNull(response.getToken());

            // Verify mock interactions
            verify(mockUserRepository, times(1)).findByUsername("wronguser");
            verify(mockPasswordService, never()).matches(anyString(), anyString());
            verify(mockJwtUtil, never()).generateToken(any());
        }

        /**
         * Test kịch bản: Login với password sai
         */
        @Test
        @DisplayName("TC3: Login thất bại với password sai")
        void testLoginFailureWrongPassword() {
            // Arrange
            LoginRequest request = new LoginRequest("testuser", "wrongPassword");

            // 1. Vẫn tìm thấy user "tạo trước"
            when(mockUserRepository.findByUsername("testuser"))
                    .thenReturn(Optional.of(existingUser));

            // 2. Nhưng khi so khớp "wrongPassword" với "encodedPassword123", hãy trả về false
            when(mockPasswordService.matches("wrongPassword", "encodedPassword123"))
                    .thenReturn(false);

            // Act
            LoginResponse response = authService.authenticate(request);

            // Assert
            assertFalse(response.isSuccess());
            assertEquals("wrong password", response.getMessage());
            assertNull(response.getToken());

            // Verify mock interactions
            verify(mockUserRepository, times(1)).findByUsername("testuser");
            verify(mockPasswordService, times(1)).matches("wrongPassword", "encodedPassword123");
            verify(mockJwtUtil, never()).generateToken(any());
        }

        /**
         * Test kịch bản: Validation error - username rỗng
         */
        @Test
        @DisplayName("TC4.1: Validation error - username rỗng")
        void testLoginFailureBlankUsername() {
            // Arrange
            LoginRequest request = new LoginRequest("", "Pass123");

            // Act
            LoginResponse response = authService.authenticate(request);

            // Assert
            assertFalse(response.isSuccess());
            assertEquals("username is required", response.getMessage());
            assertNull(response.getToken());

            // Verify no repository or service calls
            verify(mockUserRepository, never()).findByUsername(anyString());
            verify(mockPasswordService, never()).matches(anyString(), anyString());
            verify(mockJwtUtil, never()).generateToken(any());
        }

        /**
         * Test kịch bản: Validation error - password rỗng
         */
        @Test
        @DisplayName("TC4.2: Validation error - password rỗng")
        void testLoginFailureBlankPassword() {
            // Arrange
            LoginRequest request = new LoginRequest("testuser", "");

            // Act
            LoginResponse response = authService.authenticate(request);

            // Assert
            assertFalse(response.isSuccess());
            assertEquals("password is required", response.getMessage());
            assertNull(response.getToken());

            // Verify no repository or service calls
            verify(mockUserRepository, never()).findByUsername(anyString());
            verify(mockPasswordService, never()).matches(anyString(), anyString());
            verify(mockJwtUtil, never()).generateToken(any());
        }

        /**
         * Test kịch bản: Validation error - username null
         */
        @Test
        @DisplayName("TC4.3: Validation error - username null")
        void testLoginFailureNullUsername() {
            // Arrange
            LoginRequest request = new LoginRequest(null, "Pass123");

            // Act
            LoginResponse response = authService.authenticate(request);

            // Assert
            assertFalse(response.isSuccess());
            assertEquals("username is required", response.getMessage());
            assertNull(response.getToken());
        }

        /**
         * Test kịch bản: Validation error - password null
         */
        @Test
        @DisplayName("TC4.4: Validation error - password null")
        void testLoginFailureNullPassword() {
            // Arrange
            LoginRequest request = new LoginRequest("testuser", null);

            // Act
            LoginResponse response = authService.authenticate(request);

            // Assert
            assertFalse(response.isSuccess());
            assertEquals("password is required", response.getMessage());
            assertNull(response.getToken());
        }

        /**
         * Test kịch bản: Validation error - request null
         */
        @Test
        @DisplayName("TC4.5: Validation error - request null")
        void testLoginFailureNullRequest() {
            // Act
            LoginResponse response = authService.authenticate(null);

            // Assert
            assertFalse(response.isSuccess());
            assertEquals("request is null", response.getMessage());
            assertNull(response.getToken());
        }

        /**
         * Test kịch bản: Validation error - username chỉ chứa whitespace
         */
        @Test
        @DisplayName("TC4.6: Validation error - username whitespace only")
        void testLoginFailureWhitespaceUsername() {
            // Arrange
            LoginRequest request = new LoginRequest("   ", "Pass123");

            // Act
            LoginResponse response = authService.authenticate(request);

            // Assert
            assertFalse(response.isSuccess());
            assertEquals("username is required", response.getMessage());
            assertNull(response.getToken());
        }

        /**
         * Test kịch bản: Validation error - password chỉ chứa whitespace
         */
        @Test
        @DisplayName("TC4.7: Validation error - password whitespace only")
        void testLoginFailureWhitespacePassword() {
            // Arrange
            LoginRequest request = new LoginRequest("testuser", "   ");

            // Act
            LoginResponse response = authService.authenticate(request);

            // Assert
            assertFalse(response.isSuccess());
            assertEquals("password is required", response.getMessage());
            assertNull(response.getToken());
        }
    }

    // ============================================================
    // b) Test validation methods riêng lẻ (1 điểm)
    // ============================================================

    @Nested
    @DisplayName("b) Test validation methods - 1 điểm")
    class ValidationMethodsTests {

        /**
         * Test validateLoginRequest() - request null
         */
        @Test
        @DisplayName("TC5.1: validateLoginRequest throws exception when request is null")
        void testValidateLoginRequest_NullRequest() {
            // Act & Assert
            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.validateLoginRequest(null)
            );
            assertEquals("request is null", exception.getMessage());
        }

        /**
         * Test validateLoginRequest() - username null
         */
        @Test
        @DisplayName("TC5.2: validateLoginRequest throws exception when username is null")
        void testValidateLoginRequest_NullUsername() {
            // Arrange
            LoginRequest request = new LoginRequest(null, "Pass123");

            // Act & Assert
            ValidationException exception = assertThrows(
                ValidationException.class,
                () -> authService.validateLoginRequest(request)
            );
            assertEquals("username is required", exception.getMessage());
        }

        /**
         * Test validateLoginRequest() - username blank
         */
        @Test
        @DisplayName("TC5.3: validateLoginRequest throws exception when username is blank")
        void testValidateLoginRequest_BlankUsername() {
            // Arrange
            LoginRequest request = new LoginRequest("", "Pass123");

            // Act & Assert
            ValidationException exception = assertThrows(
                ValidationException.class,
                () -> authService.validateLoginRequest(request)
            );
            assertEquals("username is required", exception.getMessage());
        }

        /**
         * Test validateLoginRequest() - username whitespace only
         */
        @Test
        @DisplayName("TC5.4: validateLoginRequest throws exception when username is whitespace")
        void testValidateLoginRequest_WhitespaceUsername() {
            // Arrange
            LoginRequest request = new LoginRequest("   ", "Pass123");

            // Act & Assert
            ValidationException exception = assertThrows(
                ValidationException.class,
                () -> authService.validateLoginRequest(request)
            );
            assertEquals("username is required", exception.getMessage());
        }

        /**
         * Test validateLoginRequest() - password null
         */
        @Test
        @DisplayName("TC5.5: validateLoginRequest throws exception when password is null")
        void testValidateLoginRequest_NullPassword() {
            // Arrange
            LoginRequest request = new LoginRequest("testuser", null);

            // Act & Assert
            ValidationException exception = assertThrows(
                ValidationException.class,
                () -> authService.validateLoginRequest(request)
            );
            assertEquals("password is required", exception.getMessage());
        }

        /**
         * Test validateLoginRequest() - password blank
         */
        @Test
        @DisplayName("TC5.6: validateLoginRequest throws exception when password is blank")
        void testValidateLoginRequest_BlankPassword() {
            // Arrange
            LoginRequest request = new LoginRequest("testuser", "");

            // Act & Assert
            ValidationException exception = assertThrows(
                ValidationException.class,
                () -> authService.validateLoginRequest(request)
            );
            assertEquals("password is required", exception.getMessage());
        }

        /**
         * Test validateLoginRequest() - password whitespace only
         */
        @Test
        @DisplayName("TC5.7: validateLoginRequest throws exception when password is whitespace")
        void testValidateLoginRequest_WhitespacePassword() {
            // Arrange
            LoginRequest request = new LoginRequest("testuser", "   ");

            // Act & Assert
            ValidationException exception = assertThrows(
                ValidationException.class,
                () -> authService.validateLoginRequest(request)
            );
            assertEquals("password is required", exception.getMessage());
        }

        /**
         * Test validateLoginRequest() - valid request (không throw exception)
         */
        @Test
        @DisplayName("TC5.8: validateLoginRequest does not throw exception for valid request")
        void testValidateLoginRequest_ValidRequest() {
            // Arrange
            LoginRequest request = new LoginRequest("testuser", "Pass123");

            // Act & Assert - Không throw exception
            assertDoesNotThrow(() -> authService.validateLoginRequest(request));
        }
    }

    // ============================================================
    // Additional edge cases for better coverage
    // ============================================================

    @Nested
    @DisplayName("Edge Cases & Additional Coverage")
    class EdgeCasesTests {

        /**
         * Test với username và password hợp lệ nhưng token generation thất bại
         */
        @Test
        @DisplayName("TC6.1: Login fails when JWT generation returns null")
        void testLoginFailureJwtGenerationReturnsNull() {
            // Arrange
            when(mockUserRepository.findByUsername("testuser"))
                    .thenReturn(Optional.of(existingUser));
            when(mockPasswordService.matches("Test123", "encodedPassword123"))
                    .thenReturn(true);
            when(mockJwtUtil.generateToken(existingUser))
                    .thenReturn(null); // JWT generation returns null

            // Act
            LoginResponse response = authService.authenticate(successRequest);

            // Assert - Should still succeed but token is null
            assertTrue(response.isSuccess());
            assertEquals("login success", response.getMessage());
            assertNull(response.getToken());
        }

        /**
         * Test với username và password hợp lệ nhưng token generation throws exception
         */
        @Test
        @DisplayName("TC6.2: Login handles JWT generation exception")
        void testLoginHandlesJwtGenerationException() {
            // Arrange
            when(mockUserRepository.findByUsername("testuser"))
                    .thenReturn(Optional.of(existingUser));
            when(mockPasswordService.matches("Test123", "encodedPassword123"))
                    .thenReturn(true);
            when(mockJwtUtil.generateToken(existingUser))
                    .thenThrow(new RuntimeException("JWT generation failed"));

            // Act
            LoginResponse response = authService.authenticate(successRequest);

            // Assert
            assertFalse(response.isSuccess());
            assertEquals("JWT generation failed", response.getMessage());
            assertNull(response.getToken());
        }

        /**
         * Test với repository throws exception
         */
        @Test
        @DisplayName("TC6.3: Login handles repository exception")
        void testLoginHandlesRepositoryException() {
            // Arrange
            when(mockUserRepository.findByUsername("testuser"))
                    .thenThrow(new RuntimeException("Database connection failed"));

            // Act
            LoginResponse response = authService.authenticate(successRequest);

            // Assert
            assertFalse(response.isSuccess());
            assertEquals("Database connection failed", response.getMessage());
            assertNull(response.getToken());
        }

        /**
         * Test với password service throws exception
         */
        @Test
        @DisplayName("TC6.4: Login handles password service exception")
        void testLoginHandlesPasswordServiceException() {
            // Arrange
            when(mockUserRepository.findByUsername("testuser"))
                    .thenReturn(Optional.of(existingUser));
            when(mockPasswordService.matches("Test123", "encodedPassword123"))
                    .thenThrow(new RuntimeException("Password verification failed"));

            // Act
            LoginResponse response = authService.authenticate(successRequest);

            // Assert
            assertFalse(response.isSuccess());
            assertEquals("Password verification failed", response.getMessage());
            assertNull(response.getToken());
        }
    }
}
