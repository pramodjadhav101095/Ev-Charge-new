package com.evcharge.notification.service.sender;

import com.evcharge.notification.entity.NotificationStatus;
import com.evcharge.notification.entity.NotificationType;
import com.evcharge.notification.repository.NotificationRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "notification.whatsapp.provider", havingValue = "twilio", matchIfMissing = true)
public class WhatsAppSender implements NotificationSender {

    private final NotificationRepository repository;

    @Value("${twilio.account-sid:}")
    private String accountSid;

    @Value("${twilio.auth-token:}")
    private String authToken;

    @Value("${twilio.phone-number:}")
    private String twilioNumber;

    @PostConstruct
    public void init() {
        if (!accountSid.isEmpty() && !authToken.isEmpty()) {
            Twilio.init(accountSid, authToken);
            log.info("Twilio initialized for WhatsApp notifications");
        } else {
            log.warn("Twilio credentials not found. WhatsApp notifications will be mocked.");
        }
    }

    @Override
    public void send(String recipient, String subject, String content) {
        com.evcharge.notification.entity.Notification dbNotification = com.evcharge.notification.entity.Notification.builder()
                .type(NotificationType.WHATSAPP)
                .recipient(recipient)
                .subject(subject)
                .content(content)
                .status(NotificationStatus.PENDING)
                .build();

        if (accountSid.isEmpty() || authToken.isEmpty()) {
            log.info("MOCK WHATSAPP: To {}, Content: {}", recipient, content);
            dbNotification.setStatus(NotificationStatus.SENT);
            dbNotification.setSentAt(LocalDateTime.now());
            repository.save(dbNotification);
            return;
        }

        try {
            Message message = Message.creator(
                    new com.twilio.type.PhoneNumber("whatsapp:" + recipient),
                    new com.twilio.type.PhoneNumber("whatsapp:" + twilioNumber),
                    content)
                    .create();
            log.info("WhatsApp message sent. SID: {}", message.getSid());
            
            dbNotification.setStatus(NotificationStatus.SENT);
            dbNotification.setSentAt(LocalDateTime.now());
            repository.save(dbNotification);
        } catch (Exception e) {
            log.error("Failed to send WhatsApp message to {}", recipient, e);
            dbNotification.setStatus(NotificationStatus.FAILED);
            dbNotification.setErrorMessage(e.getMessage());
            repository.save(dbNotification);
        }
    }

    @Override
    public NotificationType supports() {
        return NotificationType.WHATSAPP;
    }
}
