package com.evcharge.session.service;

import com.evcharge.session.client.BookingClient;
import com.evcharge.session.client.StationClient;
import com.evcharge.session.dto.SessionDto;
import com.evcharge.session.entity.ChargingSession;
import com.evcharge.session.repository.ChargingSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SessionService {

    private final ChargingSessionRepository repository;
    private final BookingClient bookingClient;
    private final StationClient stationClient;
    private final SessionEventProducer eventProducer;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public SessionDto startSession(Long bookingId) {
        log.info("Starting session for booking: {}", bookingId);

        // 1. Validate booking (Simplified: always valid in mock)
        // boolean isValid = bookingClient.validateBooking(bookingId);

        ChargingSession session = ChargingSession.builder()
                .bookingId(bookingId)
                .userId(1L) // Mock from SecurityContext in real app
                .stationId(101L) // Mock from booking details
                .startTime(LocalDateTime.now())
                .energyUsed(0.0)
                .status("ACTIVE")
                .transactionId("TRX-" + System.currentTimeMillis())
                .build();

        ChargingSession saved = repository.save(session);

        // 2. Update station status
        stationClient.updateStationStatus(saved.getStationId(), "CHARGING");

        // 3. Notify via Kafka
        eventProducer.sendSessionStarted(saved);

        return mapToDto(saved);
    }

    @Transactional
    public SessionDto endSession(Long id) {
        ChargingSession session = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setEndTime(LocalDateTime.now());
        session.setStatus("ENDED");
        session.setCost(session.getEnergyUsed() * 0.25); // Mock rate

        ChargingSession saved = repository.save(session);

        // Update station back to AVAILABLE
        stationClient.updateStationStatus(saved.getStationId(), "AVAILABLE");

        // Notify via Kafka
        eventProducer.sendSessionEnded(saved);

        return mapToDto(saved);
    }

    public List<SessionDto> getActiveSessionsByUser(Long userId) {
        return repository.findByUserIdAndStatus(userId, "ACTIVE")
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Mock method called by scheduler or OCPP meter values
    public void updateEnergy(Long id, Double energyDelta) {
        repository.findById(id).ifPresent(session -> {
            session.setEnergyUsed(session.getEnergyUsed() + energyDelta);
            repository.save(session);

            // Real-time update to dashboard via WebSocket
            messagingTemplate.convertAndSend("/topic/session/" + id, mapToDto(session));

            // Optional: Publish to Kafka for analytics
            eventProducer.sendSessionUpdated(session);
        });
    }

    private SessionDto mapToDto(ChargingSession session) {
        return SessionDto.builder()
                .id(session.getId())
                .bookingId(session.getBookingId())
                .userId(session.getUserId())
                .stationId(session.getStationId())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .energyUsed(session.getEnergyUsed())
                .status(session.getStatus())
                .cost(session.getCost())
                .build();
    }
}
