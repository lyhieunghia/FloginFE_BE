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
    private final PasswordService passwordService;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordService passwordService, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse authenticate(LoginRequest request) {
        try {
            validateLoginRequest(request);

            // Scenario 1: Login with a non-existent username
            UserEntity user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("username not found"));

            boolean ok = passwordService.matches(request.getPassword(), user.getPassword());
            if (!ok) {
                // Scenario 2: Login with incorrect password
                throw new RuntimeException("wrong password");
            }

            // Scenario 3: Login successful
            String token = jwtUtil.generateToken(user);
            
            return new LoginResponse(true, "login success", token);

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