package com.evcharge.admin.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaConsumerService {

    @KafkaListener(topics = "session.updated", groupId = "admin-group")
    public void consumeSessionUpdate(String message) {
        log.info("Admin Service received session update: {}", message);
        // Logic to update live dashboards or sync billing could go here
    }

    @KafkaListener(topics = "payment.success", groupId = "admin-group")
    public void consumePaymentSuccess(String message) {
        log.info("Admin Service received payment success: {}", message);
        // Logic to update billing records
    }
}
