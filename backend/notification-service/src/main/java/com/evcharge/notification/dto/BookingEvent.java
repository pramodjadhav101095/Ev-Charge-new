package com.evcharge.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingEvent {
    private Long bookingId;
    private Long userId;
    private Long stationId;
    private String stationName;
    private LocalDateTime slotStartTime;
    private LocalDateTime slotEndTime;
    private String status;
    private String vehicleType;
    private Double estimatedCost;
    private LocalDateTime eventTimestamp;
}
