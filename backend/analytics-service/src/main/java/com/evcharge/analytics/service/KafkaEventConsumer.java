package com.evcharge.analytics.service;

import com.evcharge.analytics.entity.AnalyticsMetric;
import com.evcharge.analytics.repository.AnalyticsMetricRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaEventConsumer {

    private final AnalyticsMetricRepository repository;

    @KafkaListener(topics = "session.ended", groupId = "analytics-group")
    public void consumeSessionEnded(String message) {
        log.info("Processing session.ended event: {}", message);
        // Simplified: assuming message contains energy value and stationId
        // In real project, you'd parse JSON
        repository.save(AnalyticsMetric.builder()
                .type("USAGE")
                .stationId("S1") // Mock id
                .value(50.5) // Mock value
                .timestamp(LocalDateTime.now())
                .build());
    }

    @KafkaListener(topics = "payment.success", groupId = "analytics-group")
    public void consumePaymentSuccess(String message) {
        log.info("Processing payment.success event: {}", message);
        repository.save(AnalyticsMetric.builder()
                .type("REVENUE")
                .value(25.0) // Mock amount
                .timestamp(LocalDateTime.now())
                .build());
    }
}
