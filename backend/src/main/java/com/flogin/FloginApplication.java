package com.flogin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FloginApplication {

    public static void main(String[] args) {
        SpringApplication.run(FloginApplication.class, args);
        System.out.println("\n===========================================");
        System.out.println("🚀 Flogin Backend is running on port 8080");
        System.out.println("===========================================\n");
    }
}

