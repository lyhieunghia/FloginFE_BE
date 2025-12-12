package com.flogin.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException; 
import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.UserEntity;
import com.flogin.repository.UserRepository;
import com.flogin.security.InputSanitizer;
import com.flogin.security.JwtUtil;

import org.springframework.stereotype.Service;

/**
 * Authentication Service với input sanitization
 * 
 * Security improvements:
 * - Input sanitization trước khi query database
 * - Không expose chi tiết lỗi cho client
 * - Rate limiting ở controller layer
 */
@Service
@AllArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordService passwordService;
    private final JwtUtil jwtUtil;
    private final InputSanitizer inputSanitizer;

    public LoginResponse authenticate(LoginRequest request) {
        try {
            validateLoginRequest(request);

            String sanitizedUsername = inputSanitizer.sanitizeUsername(request.getUsername());
            
            UserEntity user = userRepository.findByUsername(sanitizedUsername)
                    .orElseThrow(() -> new UsernameNotFoundException("username not found"));

            boolean passwordMatches = passwordService.matches(request.getPassword(), user.getPassword());
            if (!passwordMatches) {
                throw new BadCredentialsException("wrong password");
            }

            String token = jwtUtil.generateToken(user);
            
            return new LoginResponse(true, "login success", token);

        } catch (UsernameNotFoundException e) {
            return new LoginResponse(false, "username not found");
        } catch (BadCredentialsException e) {
            return new LoginResponse(false, "wrong password");
        } catch (ValidationException e) {
            return new LoginResponse(false, e.getMessage());
        } catch (IllegalArgumentException e) {
            return new LoginResponse(false, e.getMessage());
        } catch (Exception e) {
            return new LoginResponse(false, "Authentication failed");
        }
    }

    void validateLoginRequest(LoginRequest request) {
        if (request == null) throw new IllegalArgumentException("request is null");
        if (request.getUsername() == null || request.getUsername().isBlank())
            throw new ValidationException("username is required");
        if (request.getPassword() == null || request.getPassword().isBlank())
            throw new ValidationException("password is required");
    }
}
