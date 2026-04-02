package com.evcharge.booking.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingEventProducer {

    private final KafkaTemplate<String, BookingEvent> kafkaTemplate;

    public static final String TOPIC_BOOKING_CREATED = "booking.created";
    public static final String TOPIC_BOOKING_CONFIRMED = "booking.confirmed";
    public static final String TOPIC_BOOKING_CANCELLED = "booking.cancelled";

    public void publishBookingCreated(BookingEvent event) {
        log.info("Publishing booking.created event for bookingId: {}", event.getBookingId());
        kafkaTemplate.send(TOPIC_BOOKING_CREATED, String.valueOf(event.getBookingId()), event);
    }

    public void publishBookingConfirmed(BookingEvent event) {
        log.info("Publishing booking.confirmed event for bookingId: {}", event.getBookingId());
        kafkaTemplate.send(TOPIC_BOOKING_CONFIRMED, String.valueOf(event.getBookingId()), event);
    }

    public void publishBookingCancelled(BookingEvent event) {
        log.info("Publishing booking.cancelled event for bookingId: {}", event.getBookingId());
        kafkaTemplate.send(TOPIC_BOOKING_CANCELLED, String.valueOf(event.getBookingId()), event);
    }
}
