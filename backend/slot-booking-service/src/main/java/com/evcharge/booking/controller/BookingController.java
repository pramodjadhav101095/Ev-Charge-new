package com.evcharge.booking.controller;

import com.evcharge.booking.dto.BookingRequest;
import com.evcharge.booking.dto.BookingResponse;
import com.evcharge.booking.dto.SlotAvailabilityResponse;
import com.evcharge.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    /**
     * Create a new booking.
     * userId is extracted from X-User-Id header set by API Gateway.
     */
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId,
            @Valid @RequestBody BookingRequest request) {
        log.info("POST /bookings - userId: {}, stationId: {}", userId, request.getStationId());
        BookingResponse response = bookingService.createBooking(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get booking by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable Long id) {
        log.info("GET /bookings/{}", id);
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    /**
     * List bookings for a user with pagination.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<BookingResponse>> getUserBookings(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("GET /bookings/user/{} - page: {}, size: {}", userId, page, size);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(bookingService.getUserBookings(userId, pageable));
    }

    /**
     * Cancel a booking.
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        log.info("PUT /bookings/{}/cancel - userId: {}", id, userId);
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }

    /**
     * Get available slots for a station on a specific date.
     */
    @GetMapping("/availability")
    public ResponseEntity<SlotAvailabilityResponse> getAvailability(
            @RequestParam Long stationId,
            @RequestParam String date) {
        log.info("GET /bookings/availability - stationId: {}, date: {}", stationId, date);
        return ResponseEntity.ok(bookingService.getSlotAvailability(stationId, date));
    }
}
