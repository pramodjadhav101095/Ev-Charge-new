package com.evcharge.notification.controller;

import com.evcharge.notification.dto.BookingEvent;
import com.evcharge.notification.dto.NotificationRequest;
import com.evcharge.notification.dto.NotificationResponse;
import com.evcharge.notification.entity.NotificationType;
import com.evcharge.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.math.BigDecimal;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;
    private final TemplateEngine templateEngine;

    @PostMapping("/send")
    public ResponseEntity<NotificationResponse> sendNotification(@Valid @RequestBody NotificationRequest request) {
        log.info("REST request to send notification via {}", request.getType());
        return ResponseEntity.ok(notificationService.sendNotification(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<NotificationResponse>> getUserNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("REST request to get notifications for user: {}", userId);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(notificationService.getUserNotifications(userId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> getNotification(@PathVariable Long id) {
        log.info("REST request to get notification: {}", id);
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    // ─── Test Endpoints for HTML Email Templates ─────────────────────

    @GetMapping("/test/booking-confirmed")
    public ResponseEntity<String> testBookingConfirmed(
            @RequestParam String email, 
            @RequestParam(defaultValue = "John Doe") String username) {
        log.info("REST request to send test booking confirmed email to {}", email);
        
        BookingEvent event = BookingEvent.builder()
                .bookingId(1024L)
                .userId(1L)
                .stationId(101L)
                .stationName("Nexus EV Fast Charging Station - Sector 62")
                .slotStartTime(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0))
                .slotEndTime(LocalDateTime.now().plusDays(1).withHour(11).withMinute(0))
                .vehicleType("FOUR_WHEELER")
                .estimatedCost(150.00)
                .build();
        
        try {
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
            String slotDate = event.getSlotStartTime().format(dateFormatter);
            String slotTime = event.getSlotStartTime().format(timeFormatter) + " - " + event.getSlotEndTime().format(timeFormatter);

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
                    .recipient(email)
                    .type(NotificationType.EMAIL)
                    .subject("Booking Confirmed: " + event.getStationName())
                    .content(htmlContent)
                    .build();

            notificationService.sendNotification(emailRequest);
            return ResponseEntity.ok("Booking confirmation test email sent successfully to " + email);
        } catch (Exception e) {
            log.error("Failed to send test booking confirmed email", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/test/booking-cancelled")
    public ResponseEntity<String> testBookingCancelled(
            @RequestParam String email, 
            @RequestParam(defaultValue = "John Doe") String username) {
        log.info("REST request to send test booking cancelled email to {}", email);
        
        BookingEvent event = BookingEvent.builder()
                .bookingId(1024L)
                .userId(1L)
                .stationId(101L)
                .stationName("Nexus EV Fast Charging Station - Sector 62")
                .slotStartTime(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0))
                .slotEndTime(LocalDateTime.now().plusDays(1).withHour(11).withMinute(0))
                .build();
        
        try {
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
            String slotDate = event.getSlotStartTime().format(dateFormatter);
            String slotTime = event.getSlotStartTime().format(timeFormatter) + " - " + event.getSlotEndTime().format(timeFormatter);

            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("bookingId", event.getBookingId());
            context.setVariable("stationName", event.getStationName());
            context.setVariable("slotDate", slotDate);
            context.setVariable("slotTime", slotTime);

            String htmlContent = templateEngine.process("booking-cancellation", context);

            NotificationRequest emailRequest = NotificationRequest.builder()
                    .userId(event.getUserId())
                    .recipient(email)
                    .type(NotificationType.EMAIL)
                    .subject("Booking Cancelled: " + event.getStationName())
                    .content(htmlContent)
                    .build();

            notificationService.sendNotification(emailRequest);
            return ResponseEntity.ok("Booking cancellation test email sent successfully to " + email);
        } catch (Exception e) {
            log.error("Failed to send test booking cancelled email", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/test/payment-success")
    public ResponseEntity<String> testPaymentSuccess(
            @RequestParam String email, 
            @RequestParam(defaultValue = "John Doe") String username) {
        log.info("REST request to send test payment success email to {}", email);
        
        try {
            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("bookingId", "1024");
            context.setVariable("amount", new BigDecimal("150.00"));
            context.setVariable("transactionId", "TXN9876543210");

            String htmlContent = templateEngine.process("payment-success", context);

            NotificationRequest emailRequest = NotificationRequest.builder()
                    .userId(1L)
                    .recipient(email)
                    .type(NotificationType.EMAIL)
                    .subject("Payment Successful - Booking #1024")
                    .content(htmlContent)
                    .build();

            notificationService.sendNotification(emailRequest);
            return ResponseEntity.ok("Payment success test email sent successfully to " + email);
        } catch (Exception e) {
            log.error("Failed to send test payment success email", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/test/whatsapp")
    public ResponseEntity<String> testWhatsApp(
            @RequestParam String phone,
            @RequestParam(defaultValue = "Hello! This is a test WhatsApp message from Ev-Charge.") String message) {
        log.info("REST request to send test WhatsApp message to {}", phone);
        try {
            NotificationRequest request = NotificationRequest.builder()
                    .userId(1L)
                    .recipient(phone)
                    .type(NotificationType.WHATSAPP)
                    .subject("Test WhatsApp Message")
                    .content(message)
                    .build();

            notificationService.sendNotification(request);
            return ResponseEntity.ok("WhatsApp test message sent successfully to " + phone);
        } catch (Exception e) {
            log.error("Failed to send test WhatsApp message", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}

