package com.evcharge.notification.config;

import com.evcharge.notification.entity.Notification;
import com.evcharge.notification.entity.NotificationStatus;
import com.evcharge.notification.entity.NotificationType;
import com.evcharge.notification.repository.NotificationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(NotificationRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(Notification.builder()
                        .userId(2L)
                        .type(NotificationType.WHATSAPP)
                        .recipient("+919012345678")
                        .subject("Welcome")
                        .content("Welcome to Ev-Charge! Your account is ready.")
                        .status(NotificationStatus.SENT)
                        .sentAt(LocalDateTime.now())
                        .build());
                
                System.out.println("✅ Notification Database Seeded with history!");
            } else {
                System.out.println("ℹ️ Notification Database already has data. Skipping seeding.");
            }
        };
    }
}
