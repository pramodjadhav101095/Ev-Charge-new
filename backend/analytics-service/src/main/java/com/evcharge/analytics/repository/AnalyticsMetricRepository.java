package com.evcharge.analytics.repository;

import com.evcharge.analytics.entity.AnalyticsMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalyticsMetricRepository extends JpaRepository<AnalyticsMetric, Long> {

    List<AnalyticsMetric> findByTypeAndTimestampBetween(String type, LocalDateTime start, LocalDateTime end);

    List<AnalyticsMetric> findByTypeAndStationIdAndTimestampBetween(String type, String stationId, LocalDateTime start,
            LocalDateTime end);

    @Query("SELECT AVG(a.value) FROM AnalyticsMetric a WHERE a.type = :type AND a.stationId = :stationId")
    Double findAverageValueByTypeAndStationId(@Param("type") String type, @Param("stationId") String stationId);
}
