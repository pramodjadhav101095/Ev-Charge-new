package com.evcharge.booking.kafka;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEvent {

    private String bookingId;
    private String paymentId;
    private double amount;
    private String status;

}
