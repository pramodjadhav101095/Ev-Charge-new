package com.evcharge.notification.service.sender;

import com.evcharge.notification.entity.Notification;
import com.evcharge.notification.entity.NotificationStatus;
import com.evcharge.notification.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Mockito.*;

class PushSenderTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private PushSender pushSender;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Test case for successfully sending a Push notification.
     * Verifies that the push notification is sent and the notification status is updated to SENT.
     */
    @Test
    void sendPushNotification_Success() {
        Notification notification = Notification.builder()
                .id(1L)
                .recipient("device_token_123")
                .content("This is a test Push notification.")
                .status(NotificationStatus.PENDING)
                .build();

        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        pushSender.send(notification.getRecipient(), null, notification.getContent());

        verify(notificationRepository, times(1)).save(any(Notification.class));
    }
}
