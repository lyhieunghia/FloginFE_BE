package com.flogin.config;

import com.flogin.entity.UserEntity;
import com.flogin.repository.UserRepository;
import com.flogin.service.PasswordService;
import java.util.Optional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordService passwordService) {
        return args -> {
            // Check if demo user already exists
            if (userRepository.findByUsername("testuser").isEmpty()) {
                UserEntity testUser = new UserEntity();
                testUser.setUsername("testuser");
                testUser.setPassword(passwordService.encode("Test123")); // Encode password
                
                userRepository.save(testUser);
                
                System.out.println("\n✅ Demo user created:");
                System.out.println("   Username: testuser");
                System.out.println("   Password: Test123\n");
            } else {
                System.out.println("\n✅ Demo user already exists:");
                System.out.println("   Username: testuser");
                System.out.println("   Password: Test123\n");
            }

            // Check and update password for 'nhanvienA'
            Optional<UserEntity> nhanvienAOpt = userRepository.findByUsername("nhanvienA");
            if (nhanvienAOpt.isPresent()) {
                UserEntity nhanvienA = nhanvienAOpt.get();
                // Check if password is not already a BCrypt hash
                if (nhanvienA.getPassword() == null || !nhanvienA.getPassword().startsWith("$2a$")) {
                    String newPassword = "123456";
                    nhanvienA.setPassword(passwordService.encode(newPassword));
                    userRepository.save(nhanvienA);
                    System.out.println("\n✅ Password for user 'nhanvienA' has been updated (encoded).");
                    System.out.println("   New password: " + newPassword + "\n");
                }
            }
        };
    }
}

