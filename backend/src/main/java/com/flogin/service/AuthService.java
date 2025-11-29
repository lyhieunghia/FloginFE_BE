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
    private final PasswordService passwordService;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordService passwordService, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.jwtUtil = jwtUtil;
    }

    // Sửa kiểu trả về từ LoginResponse -> LoginResponse
    public LoginResponse authenticate(LoginRequest request) {
        try {
            validateLoginRequest(request);

            // Scenario 1: Login with a non-existent username
            UserEntity user = userRepository.findByUsername(request.getUsername())
                    // Dùng UsernameNotFoundException đã import
                    .orElseThrow(() -> new UsernameNotFoundException("username not found"));

            boolean ok = passwordService.matches(request.getPassword(), user.getPassword());
            if (!ok) {
                // Scenario 2: Login with incorrect password
                throw new RuntimeException("wrong password");
            }

            // Scenario 3: Login successful
            String token = jwtUtil.generateToken(user);
            
            // Trả về LoginResponse như đề bài mong đợi
            return new LoginResponse(true, "login success", token);

        } catch (UsernameNotFoundException e) {
            // Bắt lỗi Scenario 1 và trả về Response
            return new LoginResponse(false, e.getMessage());
        } catch (BadCredentialsException e) {
            // Bắt lỗi Scenario 2 và trả về Response
            return new LoginResponse(false, e.getMessage());
        } catch (ValidationException | IllegalArgumentException e) {
            // Catch validation errors first
            return new LoginResponse(false, e.getMessage());
        } catch (RuntimeException e) {
            // Catch authentication errors later
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