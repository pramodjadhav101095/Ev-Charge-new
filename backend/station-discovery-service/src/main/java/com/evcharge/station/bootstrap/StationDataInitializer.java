package com.evcharge.station.bootstrap;

import com.evcharge.station.entity.ChargingStation;
import com.evcharge.station.entity.StationStatus;
import com.evcharge.station.repository.ChargingStationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class StationDataInitializer implements CommandLineRunner {

    private final ChargingStationRepository stationRepository;

    @Override
    public void run(String... args) throws Exception {
        if (stationRepository.count() == 0) {
            log.info("Populating dummy charging stations...");

            List<ChargingStation> stations = Arrays.asList(
                    ChargingStation.builder()
                            .name("Tech Park Station A")
                            .latitude(12.9716)
                            .longitude(77.5946)
                            .address("MG Road, Bangalore")
                            .status(StationStatus.AVAILABLE)
                            .type("DC Fast")
                            .connectors("CCS2, CHAdeMO")
                            .ocppIdentity("OCPP-001")
                            .build(),

                    ChargingStation.builder()
                            .name("City Mall Charger")
                            .latitude(12.9250)
                            .longitude(77.6200)
                            .address("Koramangala, Bangalore")
                            .status(StationStatus.OCCUPIED)
                            .type("AC Type 2")
                            .connectors("Type 2")
                            .ocppIdentity("OCPP-002")
                            .build(),

                    ChargingStation.builder()
                            .name("Highway Stop 42")
                            .latitude(12.8399)
                            .longitude(77.6770)
                            .address("Hosur Road, Electronic City")
                            .status(StationStatus.AVAILABLE)
                            .type("DC Fast")
                            .connectors("CCS2")
                            .ocppIdentity("OCPP-003")
                            .build(),

                    ChargingStation.builder()
                            .name("Green Park Community")
                            .latitude(13.0000)
                            .longitude(77.5500)
                            .address("Malleshwaram, Bangalore")
                            .status(StationStatus.MAINTENANCE)
                            .type("AC Type 2")
                            .connectors("Type 2")
                            .ocppIdentity("OCPP-004")
                            .build(),

                    ChargingStation.builder()
                            .name("Airport Rapid Charger")
                            .latitude(13.1986)
                            .longitude(77.7066)
                            .address("KIAL Road, Devanahalli")
                            .status(StationStatus.AVAILABLE)
                            .type("DC Ultra Fast")
                            .connectors("CCS2, CHAdeMO, Type 2")
                            .ocppIdentity("OCPP-005")
                            .build());

            stationRepository.saveAll(stations);
            log.info("Added {} dummy charging stations.", stations.size());
        } else {
            log.info("Stations already exist, skipping initialization.");
        }
    }
}
