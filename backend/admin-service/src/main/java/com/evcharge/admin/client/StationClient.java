package com.evcharge.admin.client;

import com.evcharge.admin.dto.StationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "station-discovery-service")
public interface StationClient {

    @GetMapping("/stations")
    List<StationResponse> getAllStations();

    @PostMapping("/stations")
    StationResponse createStation(@RequestBody StationResponse station);

    @PutMapping("/stations/{id}/approve")
    void approveStation(@PathVariable("id") Long id);
}
