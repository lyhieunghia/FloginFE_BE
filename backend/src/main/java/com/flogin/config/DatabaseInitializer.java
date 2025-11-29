package com.flogin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

/**
 * Database Initializer for MySQL
 * Tự động tạo database và tables khi khởi động ứng dụng
 */
@Configuration
@Profile("!test") // Không chạy khi đang test
public class DatabaseInitializer {

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    /**
     * Tạo database nếu chưa có
     * MySQL connector sẽ tự động tạo database nếu có createDatabaseIfNotExist=true
     */
    @Bean
    public CommandLineRunner initDatabase(DataSource dataSource) {
        return args -> {
            System.out.println("\n========================================");
            System.out.println("🔧 Checking MySQL Database...");
            System.out.println("========================================");

            try (Connection connection = dataSource.getConnection()) {
                System.out.println("✅ Database connection successful!");
                System.out.println("📊 Database: " + connection.getCatalog());
                System.out.println("🔗 URL: " + datasourceUrl);
                
                // Kiểm tra xem bảng users đã tồn tại chưa
                try (Statement stmt = connection.createStatement()) {
                    stmt.execute("SELECT COUNT(*) FROM users");
                    System.out.println("✅ Table 'users' already exists");
                } catch (Exception e) {
                    System.out.println("⚠️  Table 'users' not found, will be created by Hibernate");
                }
                
                System.out.println("========================================\n");
            } catch (Exception e) {
                System.err.println("❌ Database initialization failed: " + e.getMessage());
                System.err.println("Please check your MySQL configuration!");
                System.err.println("========================================\n");
            }
        };
    }
}

