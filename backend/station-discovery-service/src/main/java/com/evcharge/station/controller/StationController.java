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
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;

@RestController
@RequestMapping("/stations")
@RequiredArgsConstructor
public class StationController {

    private final StationService service;

    // 1. Test Endpoint - Must stay BEFORE the {id} mapping
    @GetMapping("/test")
    public ResponseEntity<String> testStationService() {
        return ResponseEntity.ok("test station service");
    }

    // 2. Get Single Station - Only numbers allowed now
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<StationDto> getStation(@PathVariable Long id) {
        return ResponseEntity.ok(service.getStation(id));
    }

    // 3. Nearby Stations
    @GetMapping("/nearby")
    public ResponseEntity<List<StationDto>> getNearbyStations(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "10") double radius) {

        return ResponseEntity.ok(service.findNearby(lat, lon, radius));
    }

    // 4. Create Station
    @PostMapping
   // @PreAuthorize("hasRole('ADMIN')")
 //   @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<StationDto> createStation(@RequestBody @Valid StationDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createStation(dto));
    }

    // 5. Update Status - Also protected with regex
    @PatchMapping("/{id:\\d+}/status")
    public ResponseEntity<StationDto> updateStatus(
            @PathVariable Long id,
            @RequestParam StationStatus status) {

        return ResponseEntity.ok(service.updateStationStatus(id, status));
    }

    // ====================== Exception Handler ======================
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String value = ex.getValue() != null ? ex.getValue().toString() : "null";
        String param = ex.getName();
        String required = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown";

        String message = String.format("Invalid value '%s' for '%s'. Expected %s. " +
                "ID must be a number (example: /stations/123)", value, param, required);

        return ResponseEntity.badRequest().body(message);
    }
}