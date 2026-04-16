package com.evcharge.auth.config;

import com.evcharge.auth.entity.UserCredential;
import com.evcharge.auth.repository.UserCredentialRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(UserCredentialRepository repository, PasswordEncoder encoder) {
        return args -> {
            // Only add data if the database is empty
            if (repository.count() == 0) {
                
                // 1. Seed an Admin User
                repository.save(new UserCredential(0, "admin", "admin@evcharge.com", encoder.encode("admin123"), "ROLE_ADMIN"));
                
                // 2. Seed a Regular User
                repository.save(new UserCredential(0, "pramod", "pramod@test.com", encoder.encode("password"), "ROLE_USER"));
                
                System.out.println("✅ Auth Database Seeded: Users 'admin' and 'pramod' are ready!");
            } else {
                System.out.println("ℹ️ Auth Database already has data. Skipping seeding.");
            }
        };
    }
}
