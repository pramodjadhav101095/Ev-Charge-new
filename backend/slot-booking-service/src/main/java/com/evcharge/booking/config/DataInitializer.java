package com.evcharge.booking.config;

import com.evcharge.booking.entity.Booking;
import com.evcharge.booking.entity.BookingStatus;
import com.evcharge.booking.repository.BookingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(BookingRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                // Seeding a dummy booking for testing
                repository.save(Booking.builder()
                        .userId(2L) // pramod's ID from user_db
                        .stationId(1L) // Mumbai station ID
                        .stationName("Express Charge Hub - Mumbai")
                        .slotStartTime(LocalDateTime.now().plusHours(2))
                        .slotEndTime(LocalDateTime.now().plusHours(3))
                        .status(BookingStatus.CONFIRMED)
                        .vehicleType("FOUR_WHEELER")
                        .estimatedCost(300.0)
                        .build());
                
                System.out.println("✅ Booking Database Seeded with a sample reservation!");
            } else {
                System.out.println("ℹ️ Booking Database already has data. Skipping seeding.");
            }
        };
    }
}
