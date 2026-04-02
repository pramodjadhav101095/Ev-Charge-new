package com.evcharge.booking.bootstrap;

import com.evcharge.booking.entity.Booking;
import com.evcharge.booking.entity.BookingStatus;
import com.evcharge.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingDataInitializer implements CommandLineRunner {

    private final BookingRepository bookingRepository;

    @Override
    public void run(String... args) throws Exception {
        if (bookingRepository.count() == 0) {
            log.info("Populating dummy bookings...");

            LocalDateTime now = LocalDateTime.now();

            List<Booking> bookings = Arrays.asList(
                    Booking.builder()
                            .userId(1L)
                            .stationId(1L)
                            .stationName("Tech Park Station A")
                            .slotStartTime(now.plusHours(2))
                            .slotEndTime(now.plusHours(3))
                            .status(BookingStatus.CONFIRMED)
                            .vehicleType("FOUR_WHEELER")
                            .connectorType("CCS2")
                            .estimatedCost(150.0)
                            .build(),

                    Booking.builder()
                            .userId(2L)
                            .stationId(1L)
                            .stationName("Tech Park Station A")
                            .slotStartTime(now.plusDays(1).plusHours(10))
                            .slotEndTime(now.plusDays(1).plusHours(11))
                            .status(BookingStatus.PENDING)
                            .vehicleType("TWO_WHEELER")
                            .connectorType("Type 2")
                            .estimatedCost(50.0)
                            .build(),

                    Booking.builder()
                            .userId(1L)
                            .stationId(2L)
                            .stationName("City Mall Charger")
                            .slotStartTime(now.minusDays(1).plusHours(14))
                            .slotEndTime(now.minusDays(1).plusHours(15))
                            .status(BookingStatus.CONFIRMED) // Past booking
                            .vehicleType("FOUR_WHEELER")
                            .connectorType("Type 2")
                            .estimatedCost(120.0)
                            .build());

            bookingRepository.saveAll(bookings);
            log.info("Added {} dummy bookings.", bookings.size());
        } else {
            log.info("Bookings already exist, skipping initialization.");
        }
    }
}
