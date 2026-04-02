package com.evcharge.payment.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class BookingEventConsumer {

    @KafkaListener(topics = "booking.created", groupId = "payment-group")
    public void consumeBookingCreated(Map<String, Object> bookingData) {
        log.info("Received booking created event: {}", bookingData);
        // Here we could automatically initiate a payment record as PENDING
        // but typically the frontend initiates it to get the Razorpay Order ID.
        // This is useful for async reconciliation or pre-filling.
    }
}
