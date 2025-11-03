package com.flogin.dto;

// Dùng Lombok để tự tạo getter, setter
import lombok.Data; 
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private boolean success;
    private String message;
    private String token; // Thêm token như đề bài mong đợi

    // Constructor đơn giản cho các trường hợp lỗi
    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.token = null; // Không có token khi lỗi
    }
}