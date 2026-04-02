package com.evcharge.analytics.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "payment-service")
public interface PaymentClient {
    @GetMapping("/payments/revenue")
    Double getTotalRevenue(@RequestParam("dateRange") String dateRange);
}
