package com.evcharge.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionResponse {
    private String sessionId;
    private String userId;
    private String stationId;
    private String status;
    private LocalDateTime startTime;
    private Double energyConsumed;
}
