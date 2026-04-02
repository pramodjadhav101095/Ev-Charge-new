package com.evcharge.payment.controller;

import com.evcharge.payment.entity.Payment;
import com.evcharge.payment.entity.PaymentStatus;
import com.evcharge.payment.repository.PaymentRepository;
import com.evcharge.payment.service.PaymentEventProducer;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class WebhookController {

    @Autowired
    private PaymentRepository repository;

    @Autowired
    private PaymentEventProducer eventProducer;

    @PostMapping("/payments/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {

        log.info("Received Razorpay Webhook: {}", payload);

        // In a real app, verify the webhook signature here

        JSONObject jsonPayload = new JSONObject(payload);
        String event = jsonPayload.getString("event");

        if ("payment.captured".equals(event)) {
            JSONObject paymentEntity = jsonPayload.getJSONObject("payload")
                    .getJSONObject("payment")
                    .getJSONObject("entity");

            String orderId = paymentEntity.getString("order_id");
            String paymentId = paymentEntity.getString("id");

            repository.findByRazorpayOrderId(orderId).ifPresent(payment -> {
                if (payment.getStatus() != PaymentStatus.SUCCESS) {
                    payment.setStatus(PaymentStatus.SUCCESS);
                    payment.setRazorpayPaymentId(paymentId);
                    repository.save(payment);
                    eventProducer.sendPaymentSuccessEvent(payment);
                }
            });
        }

        return ResponseEntity.ok("OK");
    }
}
