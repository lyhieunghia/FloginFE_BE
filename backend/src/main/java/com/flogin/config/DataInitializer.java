package com.flogin.config;

import com.flogin.entity.UserEntity;
import com.flogin.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository) {
        return args -> {
            // Kiểm tra xem đã có user demo chưa
            if (userRepository.findByUsername("testuser").isEmpty()) {
                UserEntity testUser = new UserEntity();
                testUser.setUsername("testuser");
                testUser.setPassword("Test123"); // Plain password for demo
                
                userRepository.save(testUser);
                
                System.out.println("\n✅ Demo user created:");
                System.out.println("   Username: testuser");
                System.out.println("   Password: Test123\n");
            } else {
                System.out.println("\n✅ Demo user already exists:");
                System.out.println("   Username: testuser");
                System.out.println("   Password: Test123\n");
            }
        };
    }
}

