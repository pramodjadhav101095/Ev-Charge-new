package com.evcharge.analytics.service;

import com.evcharge.analytics.dto.*;
import com.evcharge.analytics.entity.AnalyticsMetric;
import com.evcharge.analytics.repository.AnalyticsMetricRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsMetricRepository repository;

    @Cacheable(value = "analytics", key = "'usage-' + #stationId + '-' + #dateRange")
    public StationUsageDto getStationUsage(String stationId, String dateRange) {
        // Logic to parse dateRange and filter
        LocalDateTime start = LocalDateTime.now().minusDays(7);
        List<AnalyticsMetric> metrics = (stationId != null)
                ? repository.findByTypeAndStationIdAndTimestampBetween("USAGE", stationId, start, LocalDateTime.now())
                : repository.findByTypeAndTimestampBetween("USAGE", start, LocalDateTime.now());

        double totalEnergy = metrics.stream().mapToDouble(AnalyticsMetric::getValue).sum();

        return StationUsageDto.builder()
                .stationId(stationId)
                .totalEnergy(totalEnergy)
                .totalSessions(metrics.size())
                .averageDurationMinutes(45.0) // Mock
                .build();
    }

    @Cacheable(value = "analytics", key = "'revenue-' + #dateRange")
    public RevenueReportDto getRevenueReport(String dateRange) {
        LocalDateTime start = LocalDateTime.now().minusDays(30);
        List<AnalyticsMetric> metrics = repository.findByTypeAndTimestampBetween("REVENUE", start, LocalDateTime.now());

        double totalRevenue = metrics.stream().mapToDouble(AnalyticsMetric::getValue).sum();

        return RevenueReportDto.builder()
                .totalRevenue(totalRevenue)
                .currency("USD")
                .period(dateRange)
                .build();
    }

    public DemandPredictionDto getDemandPrediction(String stationId) {
        Double avgUsage = repository.findAverageValueByTypeAndStationId("USAGE", stationId);
        // Simple prediction logic: if avg usage > 100, demand is high
        return DemandPredictionDto.builder()
                .stationId(stationId)
                .predictedDemand((avgUsage != null && avgUsage > 100) ? 0.9 : 0.4)
                .confidence("MEDIUM")
                .build();
    }
}
