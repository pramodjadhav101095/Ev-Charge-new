package com.evcharge.notification.service.sender;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PushSender implements NotificationSender {

    // Helper method to check if configured
    private boolean isConfigured() {
        try {
            FirebaseMessaging.getInstance();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    @Async
    public void send(String token, String subject, String content) {
        sendPushNotification(token, subject, content);
    }

    @Override
    public com.evcharge.notification.entity.NotificationType supports() {
        return com.evcharge.notification.entity.NotificationType.PUSH;
    }

    @Async
    public void sendPushNotification(String token, String title, String body) {
        try {
            log.info("Sending Push Notification onto token: {}", token);

            if (!isConfigured()) {
                log.warn("Firebase not configured. Mocking Push send to {}: {} - {}", token, title, body);
                return;
            }

            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Push notification sent successfully. Response: {}", response);
        } catch (Exception e) {
            log.error("Failed to send push notification to {}", token, e);
            throw new RuntimeException("Failed to send push notification", e);
        }
    }
}
