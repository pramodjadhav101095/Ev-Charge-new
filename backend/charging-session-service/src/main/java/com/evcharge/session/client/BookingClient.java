package com.evcharge.session.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "slot-booking-service")
public interface BookingClient {
    @GetMapping("/bookings/{id}/validate")
    boolean validateBooking(@PathVariable("id") Long id);

    @GetMapping("/bookings/{id}/details")
    Object getBookingDetails(@PathVariable("id") Long id);
}
