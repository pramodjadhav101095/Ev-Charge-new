package com.evcharge.analytics.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class StationUsageDto {
    private String stationId;
    private Double totalEnergy;
    private Integer totalSessions;
    private Double averageDurationMinutes;
}
