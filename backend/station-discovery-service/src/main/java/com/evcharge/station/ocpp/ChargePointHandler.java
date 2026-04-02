package com.evcharge.station.ocpp;

import com.evcharge.station.entity.StationStatus;
import com.evcharge.station.repository.ChargingStationRepository;
import com.evcharge.station.service.StationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
@RequiredArgsConstructor
public class ChargePointHandler extends TextWebSocketHandler {

    private final ChargingStationRepository repository;
    private final StationService stationService;
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String identity = extractIdentity(session);
        sessions.put(identity, session);
        log.info("Charge point connected: {}", identity);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        String identity = extractIdentity(session);
        String payload = message.getPayload();
        log.debug("Received message from {}: {}", identity, payload);

        // Simulating OCPP 1.6/2.0 JSON Message parsing
        if (payload.contains("StatusNotification")) {
            handleStatusNotification(identity, payload);
        } else if (payload.contains("BootNotification")) {
            handleBootNotification(identity, payload);
        }
    }

    private void handleStatusNotification(String identity, String payload) {
        log.info("Handling StatusNotification for {}", identity);
        // Extract status from JSON (Simulated)
        repository.findByOcppIdentity(identity).ifPresent(station -> {
            stationService.updateStationStatus(station.getId(), StationStatus.AVAILABLE);
        });
    }

    private void handleBootNotification(String identity, String payload) {
        log.info("Handling BootNotification for {}", identity);
        // Update station to AVAILABLE on boot
    }

    private String extractIdentity(WebSocketSession session) {
        String path = session.getUri().getPath();
        return path.substring(path.lastIndexOf('/') + 1);
    }
}
