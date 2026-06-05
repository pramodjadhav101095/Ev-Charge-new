package com.evcharge.notification.consumer;

import com.evcharge.notification.client.UserClient;
import com.evcharge.notification.dto.BookingEvent;
import com.evcharge.notification.dto.PaymentEvent;
import com.evcharge.notification.dto.NotificationRequest;
import com.evcharge.notification.dto.UserDTO;
import com.evcharge.notification.entity.NotificationType;
import com.evcharge.notification.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class NotificationConsumerTest {

    @Mock
    private NotificationService notificationService;

    @Mock
    private TemplateEngine templateEngine;

    @Mock
    private UserClient userClient;

    @InjectMocks
    private NotificationConsumer notificationConsumer;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testConsumeBookingConfirmed() {
        // Arrange
        BookingEvent event = BookingEvent.builder()
                .bookingId(101L)
                .userId(1L)
                .stationId(201L)
                .stationName("Main EV Hub")
                .slotStartTime(LocalDateTime.of(2026, 6, 15, 10, 0))
                .slotEndTime(LocalDateTime.of(2026, 6, 15, 11, 0))
                .vehicleType("FOUR_WHEELER")
                .estimatedCost(150.0)
                .build();

        UserDTO user = UserDTO.builder()
                .id(1L)
                .username("JohnDoe")
                .email("john@example.com")
                .build();

        when(userClient.getUserById(1L)).thenReturn(user);
        when(templateEngine.process(eq("booking-confirmation"), any(Context.class))).thenReturn("<html>Mock HTML</html>");

        // Act
        notificationConsumer.consumeBookingConfirmed(event);

        // Assert
        verify(userClient, times(1)).getUserById(1L);
        verify(templateEngine, times(1)).process(eq("booking-confirmation"), any(Context.class));

        ArgumentCaptor<NotificationRequest> emailCaptor = ArgumentCaptor.forClass(NotificationRequest.class);
        verify(notificationService, atLeastOnce()).sendNotification(emailCaptor.capture());

        // There should be 2 notifications sent: EMAIL and WHATSAPP
        NotificationRequest emailRequest = emailCaptor.getAllValues().stream()
                .filter(req -> req.getType() == NotificationType.EMAIL)
                .findFirst().orElse(null);

        NotificationRequest whatsappRequest = emailCaptor.getAllValues().stream()
                .filter(req -> req.getType() == NotificationType.WHATSAPP)
                .findFirst().orElse(null);

        assertEquals("<html>Mock HTML</html>", emailRequest.getContent());
        assertEquals("Booking Confirmed: Main EV Hub", emailRequest.getSubject());
        assertEquals(NotificationType.WHATSAPP, whatsappRequest.getType());
    }

    @Test
    void testConsumeBookingCancelled() {
        // Arrange
        BookingEvent event = BookingEvent.builder()
                .bookingId(101L)
                .userId(1L)
                .stationId(201L)
                .stationName("Main EV Hub")
                .slotStartTime(LocalDateTime.of(2026, 6, 15, 10, 0))
                .slotEndTime(LocalDateTime.of(2026, 6, 15, 11, 0))
                .build();

        UserDTO user = UserDTO.builder()
                .id(1L)
                .username("JohnDoe")
                .build();

        when(userClient.getUserById(1L)).thenReturn(user);
        when(templateEngine.process(eq("booking-cancellation"), any(Context.class))).thenReturn("<html>Mock Cancellation HTML</html>");

        // Act
        notificationConsumer.consumeBookingCancelled(event);

        // Assert
        verify(userClient, times(1)).getUserById(1L);
        verify(templateEngine, times(1)).process(eq("booking-cancellation"), any(Context.class));

        ArgumentCaptor<NotificationRequest> captor = ArgumentCaptor.forClass(NotificationRequest.class);
        verify(notificationService, times(1)).sendNotification(captor.capture());

        NotificationRequest request = captor.getValue();
        assertEquals(NotificationType.EMAIL, request.getType());
        assertEquals("<html>Mock Cancellation HTML</html>", request.getContent());
    }

    @Test
    void testConsumePaymentSuccess() {
        // Arrange
        PaymentEvent event = PaymentEvent.builder()
                .bookingId("101")
                .userId(1L)
                .amount(new BigDecimal("150.00"))
                .transactionId("TXN999999")
                .build();

        UserDTO user = UserDTO.builder()
                .id(1L)
                .username("JohnDoe")
                .build();

        when(userClient.getUserById(1L)).thenReturn(user);
        when(templateEngine.process(eq("payment-success"), any(Context.class))).thenReturn("<html>Mock Payment HTML</html>");

        // Act
        notificationConsumer.consumePaymentSuccess(event);

        // Assert
        verify(userClient, times(1)).getUserById(1L);
        verify(templateEngine, times(1)).process(eq("payment-success"), any(Context.class));

        ArgumentCaptor<NotificationRequest> emailCaptor = ArgumentCaptor.forClass(NotificationRequest.class);
        verify(notificationService, atLeastOnce()).sendNotification(emailCaptor.capture());

        NotificationRequest emailRequest = emailCaptor.getAllValues().stream()
                .filter(req -> req.getType() == NotificationType.EMAIL)
                .findFirst().orElse(null);

        assertEquals(NotificationType.EMAIL, emailRequest.getType());
        assertEquals("<html>Mock Payment HTML</html>", emailRequest.getContent());
    }
}
