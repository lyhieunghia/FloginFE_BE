package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.UserEntity;
import com.flogin.repository.UserRepository;
import com.flogin.security.InputSanitizer;
import com.flogin.security.JwtUtil;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

// Import các hàm static của Mockito và AssertJ/JUnit để code gọn hơn
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Login Service Unit Tests") // [cite: 198]
class AuthServiceTest {

    // 1. Giả lập (Mock) các dependency mà AuthService cần
    @Mock
    private UserRepository mockUserRepository; // Giả lập kho user

    @Mock
    private PasswordService mockPasswordMatcher; // Giả lập bộ so khớp mật khẩu

    @Mock
    private JwtUtil mockJwtUtil;

    @Mock
    private InputSanitizer mockInputSanitizer;

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
        
        // Mock InputSanitizer to return username as-is
        when(mockInputSanitizer.sanitizeUsername(anyString())).thenAnswer(i -> i.getArguments()[0]);
    }

    /**
     * Test kịch bản: Đăng nhập thành công
     * [cite: 191]
     */
    @Test
    @DisplayName("TC1: Đăng nhập thành công với credentials hợp lệ") // [cite: 206]
    void testLoginSuccess() {
        // Arrange - Sắp đặt
        // 1. Khi ai đó gọi findByUsername("testuser"), hãy trả về user "tạo trước"
        when(mockUserRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(existingUser));

        // 2. Khi ai đó so khớp "Test123" với "encodedPassword123", hãy trả về true
        when(mockPasswordMatcher.matches("Test123", "encodedPassword123"))
                .thenReturn(true);

        when(mockJwtUtil.generateToken(existingUser)).thenReturn("mocked-token");

        // Act - Thực thi
        LoginResponse response = authService.authenticate(successRequest);

        // Assert - Kiểm tra
        assertTrue(response.isSuccess()); // [cite: 220]
        assertEquals("login success", response.getMessage()); // [cite: 222]
        assertNotNull(response.getToken()); // [cite: 225]
    }

    /**
     * Test kịch bản: Login với username không tồn tại
     * [cite: 192]
     */
    @Test
    @DisplayName("TC2: Login thất bại với username không tồn tại") // [cite: 232]
    void testLoginFailureWrongUsername() {
        // Arrange
        LoginRequest request = new LoginRequest("wronguser", "Pass123");

        // 1. Khi ai đó gọi findByUsername("wronguser"), hãy trả về rỗng
        when(mockUserRepository.findByUsername("wronguser"))
                .thenReturn(Optional.empty());

        // Act
        LoginResponse response = authService.authenticate(request);

        // Assert
        assertFalse(response.isSuccess()); // [cite: 243]
        assertEquals("username not found", response.getMessage());
    }

    /**
     * Test kịch bản: Login với password sai
     * [cite: 193]
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
        when(mockPasswordMatcher.matches("wrongPassword", "encodedPassword123"))
                .thenReturn(false);

        // Act
        LoginResponse response = authService.authenticate(request);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("wrong password", response.getMessage());
    }

    /**
     * Test kịch bản: Lỗi validation (username rỗng)
     * [cite: 194]
     */
    @Test
    @DisplayName("TC4: Lỗi validation khi username rỗng")
    void testLoginFailureBlankUsername() {
        // Arrange
        LoginRequest request = new LoginRequest("", "Pass123"); // Username rỗng

        // Act
        LoginResponse response = authService.authenticate(request);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("username is required", response.getMessage());
    }

    /**
     * Test kịch bản: Lỗi validation (password rỗng)
     * [cite: 194]
     */
    @Test
    @DisplayName("TC5: Lỗi validation khi password rỗng")
    void testLoginFailureBlankPassword() {
        // Arrange
        LoginRequest request = new LoginRequest("testuser", ""); // Password rỗng

        // Act
        LoginResponse response = authService.authenticate(request);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("password is required", response.getMessage());
    }
}
