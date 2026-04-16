package com.evcharge.station.config;

import com.evcharge.station.entity.ChargingStation;
import com.evcharge.station.entity.StationStatus;
import com.evcharge.station.repository.ChargingStationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ChargingStationRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(ChargingStation.builder()
                        .name("Express Charge Hub - Mumbai")
                        .latitude(19.0760)
                        .longitude(72.8777)
                        .address("Andheri East, Mumbai")
                        .status(StationStatus.AVAILABLE)
                        .type("DC Fast Charger")
                        .connectors("CCS2, CHAdeMO")
                        .ocppIdentity("CP-MUM-001")
                        .build());

                repository.save(ChargingStation.builder()
                        .name("Green Drive Station - Pune")
                        .latitude(18.5204)
                        .longitude(73.8567)
                        .address("Shivajinagar, Pune")
                        .status(StationStatus.AVAILABLE)
                        .type("AC Type 2")
                        .connectors("Type 2")
                        .ocppIdentity("CP-PUN-102")
                        .build());
                
                System.out.println("✅ Station Database Seeded with sample charging points!");
            } else {
                System.out.println("ℹ️ Station Database already has data. Skipping seeding.");
            }
        };
    }
}
