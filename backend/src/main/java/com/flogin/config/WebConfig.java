package com.flogin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Value("${cors.allowed-origins:https://localhost:3000}")
    private String[] allowedOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders(
                                "Content-Type",
                                "Authorization",
                                "X-CSRF-TOKEN",
                                "X-XSRF-TOKEN",
                                "X-Requested-With",
                                "Origin",
                                "Access-Control-Request-Method",
                                "Access-Control-Request-Headers"
                        )
                        .exposedHeaders(
                                "X-CSRF-TOKEN",
                                "X-XSRF-TOKEN",
                                "Set-Cookie",
                                "Authorization",
                                "Access-Control-Allow-Origin",
                                "X-Auth-Token"
                        )
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
