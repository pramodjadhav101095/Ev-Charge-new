package com.evcharge.admin.controller;

import com.evcharge.admin.dto.*;
import com.evcharge.admin.service.AdminService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AdminService adminService;

    /**
     * Test case for retrieving a list of users.
     * Verifies that the endpoint returns a 200 OK status and the correct user data.
     */
    @WithMockUser(roles = "ADMIN")
    @Test
    void getUsers_returnsList() throws Exception {
        UserResponse u = UserResponse.builder().id(1L).username("alice").email("a@example.com").role("ROLE_USER").build();
        when(adminService.listUsers()).thenReturn(Collections.singletonList(u));

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].username").value("alice"));

        verify(adminService, times(1)).listUsers();
    }

    /**
     * Test case for updating a user's role.
     * Verifies that the endpoint returns a 204 No Content status and calls the service method.
     */
    @WithMockUser(roles = "ADMIN")
    @Test
    void updateUserRole_returnsNoContent_andCallsService() throws Exception {
        doNothing().when(adminService).updateUserRole(42L, "ROLE_MANAGER");

        mockMvc.perform(put("/admin/users/42/role").param("role", "ROLE_MANAGER"))
                .andExpect(status().isNoContent());

        verify(adminService, times(1)).updateUserRole(42L, "ROLE_MANAGER");
    }

    /**
     * Test case for deleting a user.
     * Verifies that the endpoint returns a 204 No Content status and calls the service method.
     */
    @WithMockUser(roles = "ADMIN")
    @Test
    void deleteUser_returnsNoContent_andCallsService() throws Exception {
        doNothing().when(adminService).deleteUser(5L);

        mockMvc.perform(delete("/admin/users/5"))
                .andExpect(status().isNoContent());

        verify(adminService, times(1)).deleteUser(5L);
    }

    /**
     * Test case for retrieving a list of charging stations.
     * Verifies that the endpoint returns a 200 OK status and the correct station data.
     */
    @WithMockUser(roles = "ADMIN")
    @Test
    void getStations_returnsList() throws Exception {
        StationResponse s = StationResponse.builder().id(10L).name("Station A").location("Loc").status("PENDING").latitude(1.0).longitude(2.0).build();
        when(adminService.listStations()).thenReturn(Arrays.asList(s));

        mockMvc.perform(get("/admin/stations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10))
                .andExpect(jsonPath("$[0].name").value("Station A"));

        verify(adminService, times(1)).listStations();
    }

    /**
     * Test case for creating a new charging station.
     * Verifies that the endpoint returns a 200 OK status and the created station data.
     */
    @WithMockUser(roles = "ADMIN")
    @Test
    void createStation_returnsCreatedStation() throws Exception {
        StationResponse input = StationResponse.builder().name("New Station").location("L1").status("PENDING").latitude(0.0).longitude(0.0).build();
        StationResponse created = StationResponse.builder().id(99L).name("New Station").location("L1").status("PENDING").latitude(0.0).longitude(0.0).build();
        when(adminService.createStation(any(StationResponse.class))).thenReturn(created);

        mockMvc.perform(post("/admin/stations")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(99))
                .andExpect(jsonPath("$.name").value("New Station"));

        verify(adminService, times(1)).createStation(any(StationResponse.class));
    }

    /**
     * Test case for approving a charging station.
     * Verifies that the endpoint returns a 204 No Content status and calls the service method.
     */
    @WithMockUser(roles = "ADMIN")
    @Test
    void approveStation_returnsNoContent_andCallsService() throws Exception {
        doNothing().when(adminService).approveStation(77L);

        mockMvc.perform(put("/admin/stations/77/approve"))
                .andExpect(status().isNoContent());

        verify(adminService, times(1)).approveStation(77L);
    }

    /**
     * Test case for retrieving a list of active charging sessions.
     * Verifies that the endpoint returns a 200 OK status and the correct session data.
     */
    @WithMockUser(roles = "ADMIN")
    @Test
    void getActiveSessions_returnsList() throws Exception {
        SessionResponse s = SessionResponse.builder().sessionId("sess1").userId("u1").stationId("st1").status("ACTIVE").startTime(LocalDateTime.now()).energyConsumed(5.0).build();
        when(adminService.getActiveSessions()).thenReturn(Arrays.asList(s));

        mockMvc.perform(get("/admin/sessions/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].sessionId").value("sess1"));

        verify(adminService, times(1)).getActiveSessions();
    }

    /**
     * Test case for generating a billing report.
     * Verifies that the endpoint returns a 200 OK status and the correct report data.
     */
    @WithMockUser(roles = "ADMIN")
    @Test
    void getBillingReport_returnsReport() throws Exception {
        ReportResponse r = ReportResponse.builder().reportId("R1").type("BILLING").data("details").generatedAt(LocalDateTime.now()).build();
        when(adminService.generateBillingReport(eq("2026-01"))).thenReturn(r);

        mockMvc.perform(get("/admin/reports/billing").param("dateRange", "2026-01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reportId").value("R1"))
                .andExpect(jsonPath("$.type").value("BILLING"));

        verify(adminService, times(1)).generateBillingReport("2026-01");
    }
}
