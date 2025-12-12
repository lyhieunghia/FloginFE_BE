package com.flogin.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

/**
 * Service xử lý password hashing và verification
 * Sử dụng BCrypt để hash password an toàn
 */
@Service
@AllArgsConstructor
public class PasswordService {

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();;

    /**
     * So sánh password gốc với password đã hash trong database
     * @param rawPassword password người dùng nhập vào (chưa hash)
     * @param encodedPassword password đã hash từ database
     * @return true nếu khớp, false nếu không khớp
     */
    public boolean matches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
    /**
     * Mã hóa password sử dụng BCrypt
     * @param rawPassword password gốc
     * @return password đã được hash
     */
    public String encode(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}