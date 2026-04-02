package com.evcharge.payment.controller;

import com.evcharge.payment.dto.PaymentRequest;
import com.evcharge.payment.dto.PaymentResponse;
import com.evcharge.payment.dto.PaymentVerificationRequest;
import com.evcharge.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@Slf4j
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<PaymentResponse> initiatePayment(@Valid @RequestBody PaymentRequest request) {
        log.info("Received payment initiation request for booking: {}, mock: {}", request.getBookingId(),
                request.isMock());
        return ResponseEntity.ok(paymentService.initiatePayment(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        return ResponseEntity.ok(paymentService.verifyPayment(request));
    }

    @PostMapping("/verify-mock")
    public ResponseEntity<PaymentResponse> verifyMockPayment(@RequestBody PaymentVerificationRequest request) {
        return ResponseEntity.ok(paymentService.verifyMockPayment(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentResponse>> getUserTransactions(
            @PathVariable Long userId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        // In a real app, we'd validate headerUserId matches userId or user is Admin
        return ResponseEntity.ok(paymentService.getUserTransactions(userId));
    }
}
