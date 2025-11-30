package com.flogin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/testing")
public class TestingController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/reset")
    public ResponseEntity<String> resetDatabase() {
        try {
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0;");
            
            // Sửa dòng này:
            jdbcTemplate.execute("TRUNCATE TABLE products;"); 
            // (Bạn cũng có thể thêm "TRUNCATE TABLE users;" nếu cần)
            
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1;");
            
            return ResponseEntity.ok("Database reset successful");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Could not reset database: " + e.getMessage());
        }
    }
}