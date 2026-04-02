package com.evcharge.admin.client;

import com.evcharge.admin.dto.SessionResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "charging-session-service")
public interface SessionClient {

    @GetMapping("/sessions/active")
    List<SessionResponse> getActiveSessions();
}
