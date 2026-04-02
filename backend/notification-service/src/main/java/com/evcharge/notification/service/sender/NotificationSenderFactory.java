package com.evcharge.notification.service.sender;

import com.evcharge.notification.entity.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationSenderFactory {

    private final List<NotificationSender> senders;

    public NotificationSender getSender(NotificationType type) {
        return senders.stream()
                .filter(sender -> sender.supports() == type)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No sender found for type: " + type));
    }
}
