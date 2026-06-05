package com.evcharge.session.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

//import com.evcharge.session.dto.SessionDto;
import com.evcharge.session.dto.BookingResponse;
import com.evcharge.session.dto.PageResponse;
import com.evcharge.session.dto.SlotAvailabilityResponse;

@FeignClient(name = "slot-booking-service")
public interface BookingClient1 {

    @GetMapping("/bookings/{id}")
    BookingResponse getBooking(@PathVariable("id") Long id);

    @PutMapping("/bookings/{id}/cancel")
    BookingResponse cancelBooking(@PathVariable("id") Long id);

    @GetMapping("/bookings/user/{userId}")
    PageResponse<BookingResponse> getUserBookings(
            @PathVariable("userId") Long userId,
            @RequestParam("page") int page,
            @RequestParam("size") int size);

    @GetMapping("/bookings/availability")
    SlotAvailabilityResponse getAvailability(
            @RequestParam("stationId") Long stationId,
            @RequestParam("date") String date);

}
