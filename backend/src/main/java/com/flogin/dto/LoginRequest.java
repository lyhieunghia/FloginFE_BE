package com.flogin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Data; 
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Username không được để trống")
    @Size(min = 3, max = 16, message = "Username phải từ 3 đến 16 ký tự")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", 
        message = "Username không được chứa ký tự đặc biệt")
    private String username;
    
    @NotBlank(message = "password is required")
    @Size(min = 6, max = 50, message = "Password phải từ 6 đến 50 ký tự")
    private String password;
}