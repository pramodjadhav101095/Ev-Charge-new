package com.evcharge.notification.consumer;

import com.evcharge.notification.dto.BookingEvent;
import com.evcharge.notification.dto.NotificationRequest;
import com.evcharge.notification.entity.NotificationType;
import com.evcharge.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "booking.confirmed", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeBookingConfirmed(BookingEvent event) {
        log.info("Received Booking Confirmed Event: {}", event);

        // Send Email
        NotificationRequest emailRequest = NotificationRequest.builder()
                .userId(event.getUserId())
                .type(NotificationType.EMAIL)
                .subject("Booking Confirmed: " + event.getStationName())
                .content("Your booking at " + event.getStationName() + " is confirmed for " + event.getSlotStartTime())
                .build();

        notificationService.sendNotification(emailRequest);
    }

    @KafkaListener(topics = "booking.cancelled", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeBookingCancelled(BookingEvent event) {
        log.info("Received Booking Cancelled Event: {}", event);

        // Send Email
        NotificationRequest emailRequest = NotificationRequest.builder()
                .userId(event.getUserId())
                .type(NotificationType.EMAIL)
                .subject("Booking Cancelled: " + event.getStationName())
                .content("Your booking at " + event.getStationName() + " was cancelled.")
                .build();

        notificationService.sendNotification(emailRequest);
    }
}
