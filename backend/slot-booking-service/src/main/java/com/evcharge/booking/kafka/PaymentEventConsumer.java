package com.evcharge.booking.kafka;

import com.evcharge.payment.event.PaymentEvent;
import com.evcharge.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class PaymentEventConsumer {

    private final BookingService bookingService;

    @KafkaListener(topics = "payment.success", groupId = "slot-booking-group")
    public void handlePaymentSuccess(PaymentEvent event) {
        log.info("Received payment success event for bookingId: {}", event.getBookingId());
        try {
            Long id = Long.parseLong(event.getBookingId());
            bookingService.confirmBooking(id);
        } catch (Exception e) {
            log.error("Error processing payment success event", e);
        }
    }
}
