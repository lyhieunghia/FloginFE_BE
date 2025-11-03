package com.flogin.service;

import org.springframework.security.authentication.BadCredentialsException;
// Sửa lỗi import
import org.springframework.security.core.userdetails.UsernameNotFoundException; 
import jakarta.validation.ValidationException;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.UserEntity;
import com.flogin.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordMatcher passwordMatcher;

    public AuthService(UserRepository userRepository, PasswordMatcher passwordMatcher) {
        this.userRepository = userRepository;
        this.passwordMatcher = passwordMatcher;
    }

    // Sửa kiểu trả về từ LoginResponse -> LoginResponse
    public LoginResponse authenticate(LoginRequest request) {
        try {
            validateLoginRequest(request);

            // Scenario 1: Login với username không tồn tại
            UserEntity user = userRepository.findByUsername(request.getUsername())
                    // Dùng UsernameNotFoundException đã import
                    .orElseThrow(() -> new UsernameNotFoundException("username not found"));

            boolean ok = passwordMatcher.matches(request.getPassword(), user.getPassword());
            if (!ok) {
                // Scenario 2: Login với password sai
                throw new BadCredentialsException("wrong password");
            }

            // Scenario 3: Login thành công
            // (Giả sử bạn có một dịch vụ tạo token)
            // String token = jwtService.generateToken(user);
            String token = "trong-tien-dep-trai"; // Ví dụ token
            
            // Trả về LoginResponse như đề bài mong đợi
            return new LoginResponse(true, "login success", token);

        } catch (UsernameNotFoundException e) {
            // Bắt lỗi Scenario 1 và trả về Response
            return new LoginResponse(false, e.getMessage());
        } catch (BadCredentialsException e) {
            // Bắt lỗi Scenario 2 và trả về Response
            return new LoginResponse(false, e.getMessage());
        } catch (ValidationException | IllegalArgumentException e) {
            // Bắt lỗi Scenario 4 và trả về Response
            return new LoginResponse(false, e.getMessage());
        }
    }

    // Scenario 4: Validation Error
    void validateLoginRequest(LoginRequest request) {
        if (request == null) throw new IllegalArgumentException("request is null");
        if (request.getUsername() == null || request.getUsername().isBlank())
            throw new ValidationException("username is required");
        if (request.getPassword() == null || request.getPassword().isBlank())
            throw new ValidationException("password is required");
    }
}