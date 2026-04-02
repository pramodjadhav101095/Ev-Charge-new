package com.evcharge.admin.service;

import com.evcharge.admin.client.AnalyticsClient;
import com.evcharge.admin.client.SessionClient;
import com.evcharge.admin.client.StationClient;
import com.evcharge.admin.client.UserClient;
import com.evcharge.admin.dto.*;
import com.evcharge.admin.entity.AdminLog;
import com.evcharge.admin.repository.AdminLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserClient userClient;
    private final StationClient stationClient;
    private final SessionClient sessionClient;
    private final AnalyticsClient analyticsClient;
    private final AdminLogRepository adminLogRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public List<UserResponse> listUsers() {
        return userClient.getAllUsers();
    }

    public void updateUserRole(Long id, String role) {
        userClient.updateUserRole(id, role);
        logAction("UPDATE_ROLE", id.toString(), "Updated role to " + role);
    }

    public void deleteUser(Long id) {
        userClient.deleteUser(id);
        logAction("DELETE_USER", id.toString(), "Deleted user");
    }

    public List<StationResponse> listStations() {
        return stationClient.getAllStations();
    }

    public StationResponse createStation(StationResponse station) {
        StationResponse created = stationClient.createStation(station);
        logAction("CREATE_STATION", created.getId().toString(), "Created new station");
        return created;
    }

    public void approveStation(Long id) {
        stationClient.approveStation(id);
        kafkaTemplate.send("admin.action", "Station approved: " + id);
        logAction("APPROVE_STATION", id.toString(), "Approved station");
    }

    public List<SessionResponse> getActiveSessions() {
        return sessionClient.getActiveSessions();
    }

    @Cacheable(value = "reports", key = "#dateRange")
    public ReportResponse generateBillingReport(String dateRange) {
        // Aggregation logic would go here
        AnalyticsResponse insights = analyticsClient.getSummary();
        return ReportResponse.builder()
                .reportId("REP-" + System.currentTimeMillis())
                .type("BILLING")
                .data("Generated report for " + dateRange + ". Metric: " + insights.getMetricName() + " = "
                        + insights.getValue())
                .generatedAt(LocalDateTime.now())
                .build();
    }

    private void logAction(String action, String targetId, String details) {
        AdminLog log = AdminLog.builder()
                .action(action)
                .adminId("ADMIN-SYSTEM") // In real case, get from security context
                .targetId(targetId)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();
        adminLogRepository.save(log);
    }
}
