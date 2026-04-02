package com.evcharge.analytics.client;

import com.evcharge.analytics.dto.SessionTrendDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "charging-session-service")
public interface SessionClient {
    @GetMapping("/sessions/summary")
    Object getSessionSummary(@RequestParam("dateRange") String dateRange);
}
