package com.evcharge.payment.service;

import com.evcharge.payment.entity.Payment;
import com.evcharge.payment.event.PaymentEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PaymentEventProducer {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void sendPaymentSuccessEvent(Payment payment) {
        PaymentEvent event = PaymentEvent.builder()
                .bookingId(payment.getBookingId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .transactionId(payment.getRazorpayPaymentId())
                .build();

        log.info("Publishing payment success event for booking: {}", payment.getBookingId());
        kafkaTemplate.send("payment.success", event);
    }

    public void sendPaymentFailedEvent(Payment payment) {
        PaymentEvent event = PaymentEvent.builder()
                .bookingId(payment.getBookingId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .build();

        log.info("Publishing payment failed event for booking: {}", payment.getBookingId());
        kafkaTemplate.send("payment.failed", event);
    }
}
