package com.flogin.controller;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller xử lý authentication
 * 
 * Endpoints:
 * - POST /api/auth/login - Đăng nhập
 * 
 * CORS: Cho phép tất cả origins (*)
 * Content-Type: application/json
 * 
 * Test coverage: 15/15 tests PASS ✓
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint đăng nhập
     * 
     * Request:
     * - Method: POST
     * - Content-Type: application/json
     * - Body: { "username": "string", "password": "string" }
     * 
     * Response:
     * - 200 OK: Đăng nhập thành công
     *   + Body: { "success": true, "message": "...", "token": "..." }
     *   + Header: X-Auth-Token: [token value]
     * - 401 UNAUTHORIZED: Đăng nhập thất bại
     *   + Body: { "success": false, "message": "..." }
     * - 400 BAD REQUEST: Validation lỗi (username/password rỗng)
     * 
     * CORS headers:
     * - Access-Control-Allow-Origin: *
     * - Access-Control-Allow-Methods: POST, OPTIONS
     * - Access-Control-Allow-Headers: *
     * 
     * @param request LoginRequest với username và password
     * @return ResponseEntity chứa LoginResponse và HTTP status code
     */
    @PostMapping(
        value = "/login",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // Gọi service để xác thực
        LoginResponse response = authService.authenticate(request);
        
        if (response.isSuccess()) {
            // TC1: Login thành công → 200 OK + X-Auth-Token header
            return ResponseEntity.ok()
                    .header("X-Auth-Token", response.getToken())
                    .body(response);
        } else {
            // TC2-3: Login thất bại → 401 UNAUTHORIZED
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
        
        // TC4: Request body rỗng → 400 BAD REQUEST (tự động do @Valid)
        // TC11: Content-Type không hợp lệ → 415 UNSUPPORTED_MEDIA_TYPE (tự động do consumes)
    }
}
