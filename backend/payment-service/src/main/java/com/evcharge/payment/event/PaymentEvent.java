package com.evcharge.payment.event;

import com.evcharge.payment.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentEvent {
    private String bookingId;
    private Long userId;
    private BigDecimal amount;
    private PaymentStatus status;
    private String transactionId;
}
