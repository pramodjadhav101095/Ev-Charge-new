package com.evcharge.booking.dto;

import com.evcharge.booking.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;
    private Long stationId;
    private String stationName;
    private LocalDateTime slotStartTime;
    private LocalDateTime slotEndTime;
    private BookingStatus status;
    private String vehicleType;
    private String connectorType;
    private Double estimatedCost;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
