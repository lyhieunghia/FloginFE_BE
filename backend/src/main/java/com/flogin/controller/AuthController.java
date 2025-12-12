package com.flogin.controller;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.UserEntity;
import com.flogin.security.JwtUtil;
import com.flogin.service.AuthService;
import com.flogin.service.CustomUserDetailsService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,
                                    HttpServletResponse response,
                                    HttpServletRequest httpRequest) {
        LoginResponse loginResponse = authService.authenticate(request);

        if (!loginResponse.isSuccess()) {
            return ResponseEntity.status(401).body(loginResponse);
        }

        String token = loginResponse.getToken();

        // Thêm JWT cookie với HttpOnly
        response.addHeader("Set-Cookie",
            "jwt=" + token + "; Max-Age=" + (7*24*60*60) +
            "; Path=/; Secure; HttpOnly; SameSite='None'");

        return ResponseEntity.ok(new LoginResponse(true, "login success"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {

        String token = extractTokenFromCookie(request);
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = jwtUtil.getUsernameFromToken(token);
        UserEntity user = userDetailsService.loadUserEntityByUsername(username);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        response.addHeader("Set-Cookie",
            "jwt=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite='None'");

        return ResponseEntity.ok("logout success");
    }

    private String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals("jwt")) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
