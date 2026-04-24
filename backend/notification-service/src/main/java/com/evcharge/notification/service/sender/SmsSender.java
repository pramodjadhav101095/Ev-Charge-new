package com.evcharge.notification.service.sender;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsSender implements NotificationSender {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.phone-number}")
    private String fromPhoneNumber;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isEmpty()) {
            Twilio.init(accountSid, authToken);
            log.info("Twilio initialized");
        } else {
            log.warn("Twilio credentials not found, SMS sending will be disabled/mocked");
        }
    }

    @Override
    @Async
    public void send(String to, String subject, String content) {
        sendSms(to, content);
    }

    @Override
    public com.evcharge.notification.entity.NotificationType supports() {
        return com.evcharge.notification.entity.NotificationType.SMS;
    }

    @Async
    public void sendSms(String to, String content) {
        try {
            log.info("Sending SMS to: {}", to);
            if (accountSid == null || accountSid.isEmpty()) {
                log.warn("Twilio not configured. Mocking SMS send to {}: {}", to, content);
                return;
            }

            Message message = Message.creator(
                    new PhoneNumber(to),
                    new PhoneNumber(fromPhoneNumber),
                    content)
                    .create();

            log.info("SMS sent successfully. SID: {}", message.getSid());
        } catch (Exception e) {
            log.error("Failed to send SMS to {}", to, e);
            throw new RuntimeException("Failed to send SMS", e);
        }
    }
}
