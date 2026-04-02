package com.evcharge.notification.service;

import com.evcharge.notification.client.UserClient;
import com.evcharge.notification.dto.NotificationRequest;
import com.evcharge.notification.dto.NotificationResponse;
import com.evcharge.notification.dto.UserDTO;
import com.evcharge.notification.entity.Notification;
import com.evcharge.notification.entity.NotificationStatus;
import com.evcharge.notification.repository.NotificationRepository;
import com.evcharge.notification.service.sender.NotificationSenderFactory;
import com.evcharge.notification.service.sender.NotificationSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationSenderFactory senderFactory;
    private final UserClient userClient;

    public NotificationResponse sendNotification(NotificationRequest request) {
        log.info("Processing notification request: {}", request);

        // 1. Resolve Recipient
        String recipient = request.getRecipient();
        if (recipient == null || recipient.isEmpty()) {
            UserDTO user = userClient.getUserById(request.getUserId());
            switch (request.getType()) {
                case EMAIL -> recipient = user.getEmail();
                case SMS -> recipient = user.getPhoneNumber();
                case PUSH -> recipient = user.getDeviceToken();
            }
        }

        if (recipient == null) {
            log.error("Recipient not found for user: {}", request.getUserId());
            throw new IllegalArgumentException("Recipient address/token is missing");
        }

        // 2. Create Notification Entity
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .recipient(recipient)
                .subject(request.getSubject())
                .content(request.getContent())
                .status(NotificationStatus.PENDING)
                .build();

        notification = notificationRepository.save(notification);

        // 3. Send Notification (Delegate using Factory)
        try {
            NotificationSender sender = senderFactory.getSender(request.getType());
            sender.send(recipient, request.getSubject(), request.getContent());

            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
        } catch (Exception e) {
            log.error("Failed to send notification id: {}", notification.getId(), e);
            notification.setStatus(NotificationStatus.FAILED);
            notification.setErrorMessage(e.getMessage());
        }

        notification = notificationRepository.save(notification);
        return mapToResponse(notification);
    }

    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToResponse);
    }

    public NotificationResponse getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .type(notification.getType())
                .recipient(notification.getRecipient())
                .subject(notification.getSubject())
                .content(notification.getContent())
                .status(notification.getStatus())
                .errorMessage(notification.getErrorMessage())
                .sentAt(notification.getSentAt())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
