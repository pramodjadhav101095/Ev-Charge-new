package com.evcharge.station.kafka;

import com.evcharge.station.dto.StationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StationKafkaProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendStationCreated(StationDto station) {
        log.info("Sending station.created event for station: {}", station.getId());
        kafkaTemplate.send("station.created", station.getId().toString(), station);
    }

    public void sendStationStatusChanged(Long stationId, String status) {
        log.info("Sending station.status_changed event for station: {} -> {}", stationId, status);
        kafkaTemplate.send("station.status_changed", stationId.toString(), status);
    }
}
