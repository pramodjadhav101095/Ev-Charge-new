package com.evcharge.notification.service.sender;

import com.evcharge.notification.entity.NotificationType;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "notification.whatsapp.provider", havingValue = "twilio", matchIfMissing = true)
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
        String formattedRecipient = recipient;
        if (formattedRecipient != null && !formattedRecipient.startsWith("+")) {
            formattedRecipient = formattedRecipient.trim();
            while (formattedRecipient.startsWith("0")) {
                formattedRecipient = formattedRecipient.substring(1);
            }
            if (formattedRecipient.length() == 10) {
                formattedRecipient = "+91" + formattedRecipient;
            } else {
                formattedRecipient = "+" + formattedRecipient;
            }
            log.info("Formatted phone number from {} to {} for Twilio compliance", recipient, formattedRecipient);
        }

        if (accountSid.isEmpty() || authToken.isEmpty()) {
            log.info("MOCK WHATSAPP: To {}, Content: {}", formattedRecipient, content);
            return;
        }

        try {
            Message message = Message.creator(
                    new com.twilio.type.PhoneNumber("whatsapp:" + formattedRecipient),
                    new com.twilio.type.PhoneNumber("whatsapp:" + twilioNumber),
                    content)
                    .create();
            log.info("WhatsApp message sent. SID: {}", message.getSid());
        } catch (Exception e) {
            log.error("Failed to send WhatsApp message to {}", formattedRecipient, e);
            throw new RuntimeException("Twilio sending failed: " + e.getMessage(), e);
        }
    }

    @Override
    public NotificationType supports() {
        return NotificationType.WHATSAPP;
    }
}
