package com.evcharge.admin.client;

import com.evcharge.admin.dto.AnalyticsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "analytics-service")
public interface AnalyticsClient {

    @GetMapping("/insights/summary")
    AnalyticsResponse getSummary();
}
