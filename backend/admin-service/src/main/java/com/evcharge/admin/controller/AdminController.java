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

    /**
     * Retrieve a list of all users in the system.
     *
     * This endpoint returns a list of UserResponse DTOs representing user accounts
     * including their basic profile and role information. Only accessible to users
     * with the ADMIN role (the controller is protected with @PreAuthorize).
     *
     * HTTP: GET /admin/users
     *
     * @return 200 OK with a JSON array of users
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(adminService.listUsers());
    }

    /**
     * Update the role of a specific user.
     *
     * HTTP: PUT /admin/users/{id}/role?role={role}
     *
     * Example: PUT /admin/users/42/role?role=ROLE_MANAGER
     *
     * @param id   the numeric id of the user to update
     * @param role the new role to assign (string representation, e.g. "ROLE_ADMIN")
     * @return 204 No Content on success
     */
    @PutMapping("/users/{id}/role")
    public ResponseEntity<Void> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        adminService.updateUserRole(id, role);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete a user account by id.
     *
     * HTTP: DELETE /admin/users/{id}
     *
     * Note: Whether this is a soft-delete (mark disabled) or a hard-delete (remove
     * from database) depends on the AdminService implementation.
     *
     * @param id the numeric id of the user to delete
     * @return 204 No Content on success
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * List charging stations.
     *
     * HTTP: GET /admin/stations
     *
     * Returns a list of StationResponse DTOs. This typically includes station metadata
     * and approval status so admins can review station registrations.
     *
     * @return 200 OK with a JSON array of stations
     */
    @GetMapping("/stations")
    public ResponseEntity<List<StationResponse>> getStations() {
        return ResponseEntity.ok(adminService.listStations());
    }

    /**
     * Create a new station record.
     *
     * HTTP: POST /admin/stations
     *
     * The request body should contain a StationResponse (used here as a DTO/input).
     * On success the created station DTO is returned (may include generated id).
     *
     * @param station station data from the request body
     * @return 200 OK with the created StationResponse (consider 201 Created in future)
     */
    @PostMapping("/stations")
    public ResponseEntity<StationResponse> createStation(@RequestBody StationResponse station) {
        return ResponseEntity.ok(adminService.createStation(station));
    }

    /**
     * Approve a station registration.
     *
     * HTTP: PUT /admin/stations/{id}/approve
     *
     * Marks a pending station as approved so it becomes active/visible to users.
     *
     * @param id the numeric id of the station to approve
     * @return 204 No Content on success
     */
    @PutMapping("/stations/{id}/approve")
    public ResponseEntity<Void> approveStation(@PathVariable Long id) {
        adminService.approveStation(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get currently active charging sessions.
     *
     * HTTP: GET /admin/sessions/active
     *
     * Returns a list of SessionResponse DTOs representing sessions that are
     * currently in progress (not yet finished). Useful for monitoring.
     *
     * @return 200 OK with a JSON array of active sessions
     */
    @GetMapping("/sessions/active")
    public ResponseEntity<List<SessionResponse>> getActiveSessions() {
        return ResponseEntity.ok(adminService.getActiveSessions());
    }

    /**
     * Generate a billing report for the given date range.
     *
     * HTTP: GET /admin/reports/billing?dateRange={dateRange}
     *
     * The format of the dateRange string depends on the AdminService implementation
     * (for example it might accept "YYYY-MM" for a month, or a range like
     * "2026-01-01_to_2026-01-31"). Check the service docs or implementation for
     * the exact accepted formats.
     *
     * @param dateRange a string specifying the report period
     * @return 200 OK with a ReportResponse containing billing aggregates and details
     */
    @GetMapping("/reports/billing")
    public ResponseEntity<ReportResponse> getBillingReport(@RequestParam String dateRange) {
        return ResponseEntity.ok(adminService.generateBillingReport(dateRange));
    }
}
