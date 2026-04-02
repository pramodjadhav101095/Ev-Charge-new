package com.evcharge.admin.service;

import com.evcharge.admin.client.*;
import com.evcharge.admin.dto.*;
import com.evcharge.admin.entity.AdminLog;
import com.evcharge.admin.repository.AdminLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminServiceTest {

    /**
     * @Mock is used to create mock objects for the dependencies of the class under test.
     * These mock objects simulate the behavior of the real dependencies, allowing us to test
     * the AdminService class in isolation without relying on the actual implementations.
     */
    @Mock
    private UserClient userClient;

    @Mock
    private StationClient stationClient;

    @Mock
    private SessionClient sessionClient;

    @Mock
    private AnalyticsClient analyticsClient;

    @Mock
    private AdminLogRepository adminLogRepository;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private AdminService adminService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Test case for listing all users.
     * Verifies that the service method returns a list of users and interacts with the UserClient correctly.
     */
    @Test
    void listUsers_returnsUserList() {
        UserResponse user = UserResponse.builder().id(1L).username("testuser").email("test@example.com").role("USER").build();
        when(userClient.getAllUsers()).thenReturn(Collections.singletonList(user));

        List<UserResponse> users = adminService.listUsers();

        assertEquals(1, users.size());
        assertEquals("testuser", users.get(0).getUsername());
        verify(userClient, times(1)).getAllUsers();
    }

    /**
     * Test case for updating a user's role.
     * Verifies that the service method updates the user's role and logs the action.
     */
    @Test
    void updateUserRole_logsAction() {
        doNothing().when(userClient).updateUserRole(1L, "ADMIN");
        doNothing().when(adminLogRepository).save(any(AdminLog.class));

        adminService.updateUserRole(1L, "ADMIN");

        verify(userClient, times(1)).updateUserRole(1L, "ADMIN");
        verify(adminLogRepository, times(1)).save(any(AdminLog.class));
    }

    /**
     * Test case for deleting a user.
     * Verifies that the service method deletes the user and logs the action.
     */
    @Test
    void deleteUser_logsAction() {
        doNothing().when(userClient).deleteUser(1L);
        doNothing().when(adminLogRepository).save(any(AdminLog.class));

        adminService.deleteUser(1L);

        verify(userClient, times(1)).deleteUser(1L);
        verify(adminLogRepository, times(1)).save(any(AdminLog.class));
    }

    /**
     * Test case for listing all charging stations.
     * Verifies that the service method returns a list of stations and interacts with the StationClient correctly.
     */
    @Test
    void listStations_returnsStationList() {
        StationResponse station = StationResponse.builder().id(1L).name("Station1").location("Location1").status("ACTIVE").build();
        when(stationClient.getAllStations()).thenReturn(Collections.singletonList(station));

        List<StationResponse> stations = adminService.listStations();

        assertEquals(1, stations.size());
        assertEquals("Station1", stations.get(0).getName());
        verify(stationClient, times(1)).getAllStations();
    }

    /**
     * Test case for creating a new charging station.
     * Verifies that the service method creates a station, logs the action, and returns the created station.
     */
    @Test
    void createStation_logsAction() {
        StationResponse station = StationResponse.builder().name("Station1").location("Location1").status("PENDING").build();
        StationResponse createdStation = StationResponse.builder().id(1L).name("Station1").location("Location1").status("PENDING").build();
        when(stationClient.createStation(station)).thenReturn(createdStation);
        doNothing().when(adminLogRepository).save(any(AdminLog.class));

        StationResponse result = adminService.createStation(station);

        assertEquals(1L, result.getId());
        verify(stationClient, times(1)).createStation(station);
        verify(adminLogRepository, times(1)).save(any(AdminLog.class));
    }

    /**
     * Test case for approving a charging station.
     * Verifies that the service method approves the station, sends a Kafka message, and logs the action.
     */
    @Test
    void approveStation_logsActionAndSendsKafkaMessage() {
        doNothing().when(stationClient).approveStation(1L);
        doNothing().when(kafkaTemplate).send(anyString(), anyString());
        doNothing().when(adminLogRepository).save(any(AdminLog.class));

        adminService.approveStation(1L);

        verify(stationClient, times(1)).approveStation(1L);
        verify(kafkaTemplate, times(1)).send(anyString(), anyString());
        verify(adminLogRepository, times(1)).save(any(AdminLog.class));
    }

    /**
     * Test case for retrieving active charging sessions.
     * Verifies that the service method returns a list of active sessions and interacts with the SessionClient correctly.
     */
    @Test
    void getActiveSessions_returnsSessionList() {
        SessionResponse session = SessionResponse.builder().sessionId("sess1").userId("user1").stationId("station1").status("ACTIVE").build();
        when(sessionClient.getActiveSessions()).thenReturn(Collections.singletonList(session));

        List<SessionResponse> sessions = adminService.getActiveSessions();

        assertEquals(1, sessions.size());
        assertEquals("sess1", sessions.get(0).getSessionId());
        verify(sessionClient, times(1)).getActiveSessions();
    }

    /**
     * Test case for generating a billing report.
     * Verifies that the service method generates a report based on analytics data and returns it.
     */
    @Test
    void generateBillingReport_returnsReport() {
        AnalyticsResponse analytics = AnalyticsResponse.builder().metricName("Revenue").value(1000.0).build();
        when(analyticsClient.getSummary()).thenReturn(analytics);

        ReportResponse report = adminService.generateBillingReport("2026-01");

        assertNotNull(report);
        assertEquals("BILLING", report.getType());
        verify(analyticsClient, times(1)).getSummary();
    }
}
