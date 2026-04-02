package com.evcharge.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.Map;

@FeignClient(name = "slot-booking-service")
public interface BookingClient {
    @GetMapping("/bookings/{id}")
    Map<String, Object> getBookingById(@PathVariable("id") String id);
}
