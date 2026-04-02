package com.evcharge.station.controller;

import com.evcharge.station.dto.StationDto;
import com.evcharge.station.entity.StationStatus;
import com.evcharge.station.service.StationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stations")
@RequiredArgsConstructor
public class StationController {

    private final StationService service;

    @GetMapping("/nearby")
    public ResponseEntity<List<StationDto>> getNearbyStations(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "10") double radius) {
        return ResponseEntity.ok(service.findNearby(lat, lon, radius));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StationDto> getStation(@PathVariable Long id) {
        return ResponseEntity.ok(service.getStation(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StationDto> createStation(@RequestBody @Valid StationDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createStation(dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<StationDto> updateStatus(@PathVariable Long id, @RequestParam StationStatus status) {
        return ResponseEntity.ok(service.updateStationStatus(id, status));
    }
}
