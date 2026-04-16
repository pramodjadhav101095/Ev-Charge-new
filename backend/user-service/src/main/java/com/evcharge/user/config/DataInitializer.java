package com.evcharge.user.config;

import com.evcharge.user.entity.User;
import com.evcharge.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                // Seeding profile for admin
                repository.save(new User(null, "admin", "admin@evcharge.com", "9876543210", "ROLE_ADMIN", "Tesla Model 3"));
                
                // Seeding profile for pramod
                repository.save(new User(null, "pramod", "pramod@test.com", "9123456780", "ROLE_USER", "Tata Nexon EV"));
                
                System.out.println("✅ User Database Seeded with dummy profiles!");
            } else {
                System.out.println("ℹ️ User Database already has data. Skipping seeding.");
            }
        };
    }
}
