package com.flogin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Kích hoạt CORS (sử dụng bean WebConfig của bạn)
            .cors(withDefaults())
            
            // 2. Tắt CSRF
            .csrf(csrf -> csrf.disable())
            
            // 3. Cấu hình API của chúng ta là "stateless" (không dùng session)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 4. Phân quyền truy cập
            .authorizeHttpRequests(auth -> auth
                // 5. CHO PHÉP TẤT CẢ mọi request đến "/api/**"
                // Điều này quan trọng nhất để test API
                .requestMatchers("/api/**").permitAll()
                
                // 6. Các request khác có thể yêu cầu xác thực (nếu cần)
                .anyRequest().authenticated()
            )
            
            // 7. Tắt form đăng nhập mặc định của Spring
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}