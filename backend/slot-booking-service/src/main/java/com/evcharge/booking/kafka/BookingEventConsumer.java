package com.evcharge.booking.kafka;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
public class BookingEventConsumer {

    @KafkaListener(topics = "station.status.updated", groupId = "slot-booking-group")
    public void handleStationStatusUpdate(Map<String, Object> event) {
        log.info("Received station status update: {}", event);
        // Handle station status changes that may affect slot availability
        // e.g., station goes offline -> cancel pending bookings
        Object stationId = event.get("stationId");
        Object newStatus = event.get("status");
        if (stationId != null && "OFFLINE".equals(newStatus)) {
            log.warn("Station {} went OFFLINE. Pending bookings may need cancellation.", stationId);
            // Could inject BookingService here for auto-cancellation if needed
        }
    }
}
