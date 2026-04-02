package com.evcharge.booking.kafka;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingEvent implements Serializable {
    private Long bookingId;
    private Long userId;
    private Long stationId;
    private String stationName;
    private LocalDateTime slotStartTime;
    private LocalDateTime slotEndTime;
    private String status; // CREATED, CONFIRMED, CANCELLED
    private String vehicleType;
    private Double estimatedCost;
    private LocalDateTime eventTimestamp;
}
