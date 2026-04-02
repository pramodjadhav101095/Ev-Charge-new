package com.evcharge.notification.service.sender;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailSender implements NotificationSender {

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Override
    @Async
    public void send(String to, String subject, String content) {
        sendEmail(to, subject, content);
    }

    @Override
    public com.evcharge.notification.entity.NotificationType supports() {
        return com.evcharge.notification.entity.NotificationType.EMAIL;
    }

    @Async
    public void sendEmail(String to, String subject, String content) {
        try {
            log.info("Sending email to: {}", to);
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setText(content, true); // true = isHtml
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("noreply@evcharge.com"); // Configure in properties ideally

            javaMailSender.send(mimeMessage);
            log.info("Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public String processTemplate(String templateName, Context context) {
        return templateEngine.process(templateName, context);
    }
}
