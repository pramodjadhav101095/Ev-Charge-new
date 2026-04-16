package com.evcharge.notification.service.sender;

import com.evcharge.notification.entity.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "notification.whatsapp.provider", havingValue = "gupshup")
public class GupshupSender implements NotificationSender {

    @Value("${gupshup.api-key:}")
    private String apiKey;

    @Value("${gupshup.source-number:}")
    private String sourceNumber;

    @Value("${gupshup.app-name:}")
    private String appName;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void send(String recipient, String subject, String content) {
        if (apiKey.isEmpty()) {
            log.info("MOCK GUPSHUP: To {}, Content: {}", recipient, content);
            return;
        }

        try {
            log.info("Sending WhatsApp message via Gupshup to {}", recipient);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("apikey", apiKey);

            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("channel", "whatsapp");
            map.add("source", sourceNumber);
            map.add("destination", recipient);
            // Gupshup expects message in a specific JSON format for text
            map.add("message", "{\"type\":\"text\",\"text\":\"" + content + "\"}");
            map.add("src.name", appName);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
            ResponseEntity<String> response = restTemplate.postForEntity("https://api.gupshup.io/sm/api/v1/msg", request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Gupshup message sent successfully. Response: {}", response.getBody());
            } else {
                log.error("Gupshup message failed. Status: {}, Response: {}", response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            log.error("Error occurred while sending Gupshup message to {}", recipient, e);
        }
    }

    @Override
    public NotificationType supports() {
        return NotificationType.WHATSAPP;
    }
}
