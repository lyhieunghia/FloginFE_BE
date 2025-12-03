package com.flogin.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/testing")
public class TestingController {

    private static final Logger logger = LoggerFactory.getLogger(TestingController.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/reset")
    public ResponseEntity<String> resetDatabase() {
        try {
            logger.info("Starting database reset for testing...");
            
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0;");
            
            // Clear products table
            jdbcTemplate.execute("TRUNCATE TABLE products;");
            logger.info("Products table truncated");
            
            // Clear users table and re-add test user
            jdbcTemplate.execute("TRUNCATE TABLE users;");
            jdbcTemplate.execute(
                "INSERT INTO users (username, password) VALUES " +
                "('testuser', '$2a$10$eW1Kd9J2Lh6hGt9Q9jH7P.xGLW5g8sP9pZ/YgYR9Lzb8Q7gHLp7Dq')"
            );
            logger.info("Users table reset with test user");
            
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1;");
            
            logger.info("Database reset successful");
            return ResponseEntity.ok("Database reset successful");
        } catch (Exception e) {
            logger.error("Database reset failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Could not reset database: " + e.getMessage());
        }
    }
}