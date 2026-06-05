package com.evcharge.session.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "station-discovery-service")
public interface StationClient {
    @PatchMapping("/stations/{id}/status")
    void updateStationStatus(@PathVariable("id") Long id, @RequestParam("status") String status);
}
