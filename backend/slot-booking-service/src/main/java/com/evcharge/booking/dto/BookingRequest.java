package com.evcharge.booking.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {

    @NotNull(message = "Station ID is required")
    private Long stationId;

    @NotNull(message = "Slot start time is required")
    @Future(message = "Slot start time must be in the future")
    private LocalDateTime slotStartTime;

    @NotNull(message = "Slot end time is required")
    @Future(message = "Slot end time must be in the future")
    private LocalDateTime slotEndTime;

    private String vehicleType; // TWO_WHEELER, FOUR_WHEELER

    private String connectorType;
}
