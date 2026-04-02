package com.evcharge.admin.client;

import com.evcharge.admin.dto.PaymentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "payment-service")
public interface PaymentClient {

    @GetMapping("/payments/history")
    List<PaymentResponse> getPaymentHistory();
}
