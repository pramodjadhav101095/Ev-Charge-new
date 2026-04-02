package com.evcharge.analytics.controller;

import com.evcharge.analytics.dto.*;
import com.evcharge.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/stations/usage")
    public ResponseEntity<StationUsageDto> getStationUsage(
            @RequestParam(required = false) String stationId,
            @RequestParam String dateRange) {
        return ResponseEntity.ok(analyticsService.getStationUsage(stationId, dateRange));
    }

    @GetMapping("/revenue")
    public ResponseEntity<RevenueReportDto> getRevenueReport(@RequestParam String dateRange) {
        return ResponseEntity.ok(analyticsService.getRevenueReport(dateRange));
    }

    @GetMapping("/predictions/demand")
    public ResponseEntity<DemandPredictionDto> getDemandPrediction(@RequestParam String stationId) {
        return ResponseEntity.ok(analyticsService.getDemandPrediction(stationId));
    }
}
