package com.evcharge.booking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "PAYMENT-SERVICE", path = "/payments")
public interface PaymentClient {

    @PostMapping("/initiate")
    Map<String, Object> initiatePayment(@RequestBody Map<String, Object> paymentRequest);
}
