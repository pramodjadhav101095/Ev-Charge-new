package com.evcharge.session.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionDto {
    private Long id;
    private Long bookingId;
    private Long userId;
    private Long stationId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double energyUsed;
    private String status;
    private Double cost;
}
