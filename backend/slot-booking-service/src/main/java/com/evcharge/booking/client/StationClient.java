package com.evcharge.booking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.evcharge.booking.dto.StationDto;

import java.util.Map;

@FeignClient(name = "STATION-DISCOVERY-SERVICE", path = "/stations")
public interface StationClient {

    @GetMapping("/{id}")
    Map<String, Object> getStationById(@PathVariable("id") Long id);

    @GetMapping("/{id}")
    StationDto getStation(@PathVariable("id") Long id);
}
