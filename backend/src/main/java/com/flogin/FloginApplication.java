package com.flogin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class FloginApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(FloginApplication.class);
    private final Environment environment;

    public FloginApplication(Environment environment) {
        this.environment = environment;
    }

    public static void main(String[] args) {
        SpringApplication.run(FloginApplication.class, args);
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        String port = environment.getProperty("server.port", "8080");
        logger.info("\n===========================================");
        logger.info("🚀 Flogin Backend is READY on port {}", port);
        logger.info("🏥 Health check: http://localhost:{}/api/test/health", port);
        logger.info("===========================================\n");
        
        System.out.println("\n===========================================");
        System.out.println("🚀 Flogin Backend is READY on port " + port);
        System.out.println("🏥 Health check: http://localhost:" + port + "/api/test/health");
        System.out.println("===========================================\n");
    }
}


