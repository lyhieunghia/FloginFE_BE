package com.flogin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Lớp khởi động chính của ứng dụng Spring Boot.
 */
@SpringBootApplication
public class FloginApplication {

    public static void main(String[] args) {
        // Dòng này sẽ khởi chạy server web (Tomcat) và quét các component
        SpringApplication.run(FloginApplication.class, args);
    }
}
