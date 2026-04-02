package com.evcharge.analytics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DemandPredictionDto {
    private String stationId;
    private Double predictedDemand; // 0.0 to 1.0 or session count
    private String confidence;
}
