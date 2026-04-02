package com.evcharge.session.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Async
@Slf4j
@RequiredArgsConstructor
public class SessionEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendSessionStarted(Object sessionData) {
        log.info("Publishing session.started event");
        kafkaTemplate.send("session.started", sessionData);
    }

    public void sendSessionUpdated(Object sessionData) {
        log.info("Publishing session.updated event");
        kafkaTemplate.send("session.updated", sessionData);
    }

    public void sendSessionEnded(Object sessionData) {
        log.info("Publishing session.ended event");
        kafkaTemplate.send("session.ended", sessionData);
    }
}
