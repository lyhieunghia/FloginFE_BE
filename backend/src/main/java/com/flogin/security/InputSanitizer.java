package com.flogin.security;

import org.springframework.stereotype.Component;
import org.owasp.encoder.Encode;

/**
 * Input Sanitizer để chống XSS và injection attacks
 * 
 * Sử dụng OWASP Java Encoder để sanitize input
 * Note: Cần thêm dependency: org.owasp.encoder:encoder
 */
@Component
public class InputSanitizer {

    /**
     * Sanitize HTML input để chống XSS
     * Encode các ký tự đặc biệt HTML
     */
    public String sanitizeHtml(String input) {
        if (input == null) {
            return null;
        }
        return Encode.forHtml(input.trim());
    }

    /**
     * Sanitize JavaScript context
     */
    public String sanitizeJavaScript(String input) {
        if (input == null) {
            return null;
        }
        return Encode.forJavaScript(input.trim());
    }

    /**
     * Sanitize SQL input (bổ sung cho PreparedStatement)
     * Loại bỏ các ký tự nguy hiểm
     */
    public String sanitizeSql(String input) {
        if (input == null) {
            return null;
        }
        // Remove SQL injection characters
        return input.trim()
                .replaceAll("[';\"\\\\-]", "")
                .replaceAll("(?i)(union|select|insert|update|delete|drop|create|alter|exec|execute)", "");
    }

    /**
     * Sanitize username - chỉ cho phép alphanumeric và underscore
     */
    public String sanitizeUsername(String username) {
        if (username == null) {
            return null;
        }
        return username.trim().replaceAll("[^a-zA-Z0-9_]", "");
    }

    /**
     * Remove potential XSS vectors
     */
    public String removeXssVectors(String input) {
        if (input == null) {
            return null;
        }
        
        return input
            .replaceAll("<script[^>]*>.*?</script>", "")
            .replaceAll("<iframe[^>]*>.*?</iframe>", "")
            .replaceAll("javascript:", "")
            .replaceAll("onerror=", "")
            .replaceAll("onload=", "")
            .replaceAll("onclick=", "")
            .trim();
    }
}
