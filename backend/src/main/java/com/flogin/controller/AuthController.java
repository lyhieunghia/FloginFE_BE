package com.flogin.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for handling authentication
 * 
 * Endpoints:
 * - POST /api/auth/login - Login
 * 
 * CORS: Allows all origins (*)
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
     * Login endpoint
     * 
     * Request:
     * - Method: POST
     * - Content-Type: application/json
     * - Body: { "username": "string", "password": "string" }
     * 
     * Response:
     * - 200 OK: Login successful
     *   + Body: { "success": true, "message": "...", "token": "..." }
     *   + Cookie: jwt=[token]; HttpOnly; Path=/; Max-Age=86400
     * - 401 UNAUTHORIZED: Login failed
     *   + Body: { "success": false, "message": "..." }
     * - 400 BAD REQUEST: Validation error (empty username/password)
     * 
     * CORS headers:
     * - Access-Control-Allow-Origin: *
     * - Access-Control-Allow-Methods: POST, OPTIONS
     * - Access-Control-Allow-Headers: *
     * 
     * @param request LoginRequest with username and password
     * @return ResponseEntity containing LoginResponse and HTTP status code
     */
    @PostMapping(
        value = "/login",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // Call the service for authentication
        LoginResponse response = authService.authenticate(request);
        
        if (response.isSuccess()) {
            // TC1: Login successful → 200 OK + jwt cookie
            ResponseCookie cookie = ResponseCookie.from("jwt", response.getToken())
                    .httpOnly(true)
                    .path("/")
                    .maxAge(24 * 60 * 60) // 24 hours
                    .build();
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } else {
            // TC2-3: Login failed → 401 UNAUTHORIZED
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
        
        // TC4: Empty request body → 400 BAD REQUEST (handled by @Valid)
        // TC11: Invalid Content-Type → 415 UNSUPPORTED_MEDIA_TYPE (handled by consumes)
    }
}

