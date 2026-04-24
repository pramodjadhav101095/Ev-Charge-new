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
    public ResponseEntity<PaymentResponse> initiatePayment(
            @RequestHeader(value = "X-User-Id") String headerUserId,
            @Valid @RequestBody PaymentRequest request) {
        log.info("Received payment initiation request for booking: {}, user: {}", 
                request.getBookingId(), headerUserId);
        
        // Override request userId with authenticated userId from Gateway
        request.setUserId(Long.parseLong(headerUserId));
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
            @RequestHeader(value = "X-User-Id") String headerUserId) {
        
        // Security check: Match the path ID with the authenticated header ID
        if (!headerUserId.equals(String.valueOf(userId))) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(paymentService.getUserTransactions(userId));
    }
}
