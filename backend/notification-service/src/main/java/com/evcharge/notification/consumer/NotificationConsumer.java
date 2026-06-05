package com.evcharge.notification.consumer;

import com.evcharge.notification.client.UserClient;
import com.evcharge.notification.dto.PaymentEvent;
import com.evcharge.notification.dto.BookingEvent;
import com.evcharge.notification.dto.NotificationRequest;
import com.evcharge.notification.dto.UserDTO;
import com.evcharge.notification.entity.NotificationType;
import com.evcharge.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final NotificationService notificationService;
    private final TemplateEngine templateEngine;
    private final UserClient userClient;

    @KafkaListener(topics = "booking.confirmed", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeBookingConfirmed(BookingEvent event) {
        log.info("Received Booking Confirmed Event: {}", event);

        // Send Email
        try {
            String username = "Valued Customer";
            try {
                UserDTO user = userClient.getUserById(event.getUserId());
                if (user != null && user.getUsername() != null) {
                    username = user.getUsername();
                }
            } catch (Exception e) {
                log.warn("Failed to fetch user info for email personalization: userId={}", event.getUserId(), e);
            }

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
            String slotDate = event.getSlotStartTime() != null ? event.getSlotStartTime().format(dateFormatter) : "N/A";
            String slotTime = "N/A";
            if (event.getSlotStartTime() != null && event.getSlotEndTime() != null) {
                slotTime = event.getSlotStartTime().format(timeFormatter) + " - " + event.getSlotEndTime().format(timeFormatter);
            }

            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("bookingId", event.getBookingId());
            context.setVariable("stationName", event.getStationName());
            context.setVariable("slotDate", slotDate);
            context.setVariable("slotTime", slotTime);
            context.setVariable("vehicleType", event.getVehicleType());
            context.setVariable("estimatedCost", event.getEstimatedCost());

            String htmlContent = templateEngine.process("booking-confirmation", context);

            NotificationRequest emailRequest = NotificationRequest.builder()
                    .userId(event.getUserId())
                    .type(NotificationType.EMAIL)
                    .subject("Booking Confirmed: " + event.getStationName())
                    .content(htmlContent)
                    .build();

            notificationService.sendNotification(emailRequest);
        } catch (Exception e) {
            log.error("Failed to send Email notification for booking confirmed: event={}", event, e);
        }

        // Send WhatsApp
        try {
            NotificationRequest whatsappRequest = NotificationRequest.builder()
                    .userId(event.getUserId())
                    .type(NotificationType.WHATSAPP)
                    .subject("Booking Confirmed")
                    .content("Your EV Charging slot at " + event.getStationName() + " is confirmed for " + event.getSlotStartTime() + ". Thank you!")
                    .build();

            notificationService.sendNotification(whatsappRequest);
        } catch (Exception e) {
            log.error("Failed to send WhatsApp notification for booking confirmed: event={}", event, e);
        }
    }

    @KafkaListener(topics = "booking.cancelled", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeBookingCancelled(BookingEvent event) {
        log.info("Received Booking Cancelled Event: {}", event);

        // Send Email
        try {
            String username = "Valued Customer";
            try {
                UserDTO user = userClient.getUserById(event.getUserId());
                if (user != null && user.getUsername() != null) {
                    username = user.getUsername();
                }
            } catch (Exception e) {
                log.warn("Failed to fetch user info for email personalization: userId={}", event.getUserId(), e);
            }

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
            String slotDate = event.getSlotStartTime() != null ? event.getSlotStartTime().format(dateFormatter) : "N/A";
            String slotTime = "N/A";
            if (event.getSlotStartTime() != null && event.getSlotEndTime() != null) {
                slotTime = event.getSlotStartTime().format(timeFormatter) + " - " + event.getSlotEndTime().format(timeFormatter);
            }

            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("bookingId", event.getBookingId());
            context.setVariable("stationName", event.getStationName());
            context.setVariable("slotDate", slotDate);
            context.setVariable("slotTime", slotTime);

            String htmlContent = templateEngine.process("booking-cancellation", context);

            NotificationRequest emailRequest = NotificationRequest.builder()
                    .userId(event.getUserId())
                    .type(NotificationType.EMAIL)
                    .subject("Booking Cancelled: " + event.getStationName())
                    .content(htmlContent)
                    .build();

            notificationService.sendNotification(emailRequest);
        } catch (Exception e) {
            log.error("Failed to send Email notification for booking cancelled: event={}", event, e);
        }
    }

    @KafkaListener(topics = "payment.success", groupId = "${spring.kafka.consumer.group-id}")
    public void consumePaymentSuccess(PaymentEvent event) {
        log.info("Received Payment Success Event: {}", event);

        // Send Email
        try {
            String username = "Valued Customer";
            try {
                UserDTO user = userClient.getUserById(event.getUserId());
                if (user != null && user.getUsername() != null) {
                    username = user.getUsername();
                }
            } catch (Exception e) {
                log.warn("Failed to fetch user info for email personalization: userId={}", event.getUserId(), e);
            }

            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("bookingId", event.getBookingId());
            context.setVariable("amount", event.getAmount());
            context.setVariable("transactionId", event.getTransactionId());

            String htmlContent = templateEngine.process("payment-success", context);

            NotificationRequest emailRequest = NotificationRequest.builder()
                    .userId(event.getUserId())
                    .type(NotificationType.EMAIL)
                    .subject("Payment Successful - Booking #" + event.getBookingId())
                    .content(htmlContent)
                    .build();

            notificationService.sendNotification(emailRequest);
        } catch (Exception e) {
            log.error("Failed to send Email notification for payment success: event={}", event, e);
        }

        // Send WhatsApp
        try {
            NotificationRequest whatsappRequest = NotificationRequest.builder()
                    .userId(event.getUserId())
                    .type(NotificationType.WHATSAPP)
                    .subject("Payment Successful")
                    .content("Your payment of Rs." + event.getAmount() + " for Booking #" + event.getBookingId() + " was successful. Transaction ID: " + event.getTransactionId() + ". Thank you!")
                    .build();

            notificationService.sendNotification(whatsappRequest);
        } catch (Exception e) {
            log.error("Failed to send WhatsApp notification for payment success: event={}", event, e);
        }
    }
}
