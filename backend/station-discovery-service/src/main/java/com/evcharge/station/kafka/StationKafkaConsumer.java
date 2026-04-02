package com.evcharge.station.kafka;

import com.evcharge.station.entity.StationStatus;
import com.evcharge.station.service.StationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class StationKafkaConsumer {

    private final StationService stationService;

    @KafkaListener(topics = "session.started", groupId = "station-discovery-group")
    public void handleSessionStarted(String stationId) {
        log.info("Received session.started for station: {}. Marking as OCCUPIED.", stationId);
        stationService.updateStationStatus(Long.parseLong(stationId), StationStatus.OCCUPIED);
    }

    @KafkaListener(topics = "session.ended", groupId = "station-discovery-group")
    public void handleSessionEnded(String stationId) {
        log.info("Received session.ended for station: {}. Marking as AVAILABLE.", stationId);
        stationService.updateStationStatus(Long.parseLong(stationId), StationStatus.AVAILABLE);
    }
}
