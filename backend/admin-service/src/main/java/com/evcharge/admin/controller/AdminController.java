package com.evcharge.admin.controller;

import com.evcharge.admin.dto.*;
import com.evcharge.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(adminService.listUsers());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<Void> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        adminService.updateUserRole(id, role);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stations")
    public ResponseEntity<List<StationResponse>> getStations() {
        return ResponseEntity.ok(adminService.listStations());
    }

    @PostMapping("/stations")
    public ResponseEntity<StationResponse> createStation(@RequestBody StationResponse station) {
        return ResponseEntity.ok(adminService.createStation(station));
    }

    @PutMapping("/stations/{id}/approve")
    public ResponseEntity<Void> approveStation(@PathVariable Long id) {
        adminService.approveStation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sessions/active")
    public ResponseEntity<List<SessionResponse>> getActiveSessions() {
        return ResponseEntity.ok(adminService.getActiveSessions());
    }

    @GetMapping("/reports/billing")
    public ResponseEntity<ReportResponse> getBillingReport(@RequestParam String dateRange) {
        return ResponseEntity.ok(adminService.generateBillingReport(dateRange));
    }
}
