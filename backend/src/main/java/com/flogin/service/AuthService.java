package com.flogin.service;

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

    public LoginResponse authenticate(LoginRequest request) {
        try {
            validateLoginRequest(request);

            // Scenario 1: Login với username không tồn tại
            UserEntity user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("username not found"));

            boolean ok = passwordMatcher.matches(request.getPassword(), user.getPassword());
            if (!ok) {
                // Scenario 2: Login với password sai
                throw new RuntimeException("wrong password");
            }

            // Scenario 3: Login thành công
            String token = "trinh-tran-phuong-tuan"; // Ví dụ token
            
            return new LoginResponse(true, "login success", token);

        } catch (ValidationException | IllegalArgumentException e) {
            // Bắt lỗi validation trước
            return new LoginResponse(false, e.getMessage());
        } catch (RuntimeException e) {
            // Bắt lỗi authentication sau
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