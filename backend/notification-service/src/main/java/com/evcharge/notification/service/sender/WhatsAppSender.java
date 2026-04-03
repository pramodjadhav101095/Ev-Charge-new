package com.evcharge.notification.service.sender;

import com.evcharge.notification.entity.NotificationType;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
@Slf4j
public class WhatsAppSender implements NotificationSender {

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
        if (accountSid.isEmpty() || authToken.isEmpty()) {
            log.info("MOCK WHATSAPP: To {}, Content: {}", recipient, content);
            return;
        }

        try {
            Message message = Message.creator(
                    new com.twilio.type.PhoneNumber("whatsapp:" + recipient),
                    new com.twilio.type.PhoneNumber("whatsapp:" + twilioNumber),
                    content)
                    .create();
            log.info("WhatsApp message sent. SID: {}", message.getSid());
        } catch (Exception e) {
            log.error("Failed to send WhatsApp message to {}", recipient, e);
        }
    }

    @Override
    public NotificationType supports() {
        return NotificationType.WHATSAPP;
    }
}
