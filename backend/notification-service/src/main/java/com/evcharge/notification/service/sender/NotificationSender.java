package com.evcharge.notification.service.sender;

import com.evcharge.notification.entity.NotificationType;

public interface NotificationSender {
    void send(String recipient, String subject, String content);

    NotificationType supports();
}
