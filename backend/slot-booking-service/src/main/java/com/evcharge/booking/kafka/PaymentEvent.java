package com.evcharge.booking.kafka;

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
    private String status;
    private String transactionId;
}
