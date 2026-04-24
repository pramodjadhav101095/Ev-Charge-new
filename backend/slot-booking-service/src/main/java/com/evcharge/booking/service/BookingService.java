package com.evcharge.booking.service;

import com.evcharge.booking.client.StationClient;
import com.evcharge.booking.dto.BookingRequest;
import com.evcharge.booking.dto.BookingResponse;
import com.evcharge.booking.dto.SlotAvailabilityResponse;
import com.evcharge.booking.entity.Booking;
import com.evcharge.booking.entity.BookingStatus;
import com.evcharge.booking.exception.BookingNotFoundException;
import com.evcharge.booking.exception.SlotUnavailableException;
import com.evcharge.booking.kafka.BookingEvent;
import com.evcharge.booking.kafka.BookingEventProducer;
import com.evcharge.booking.mapper.BookingMapper;
import com.evcharge.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final BookingEventProducer eventProducer;
    private final RedissonClient redissonClient;
    private final StationClient stationClient;

    @Value("${booking.slot-duration-minutes:60}")
    private int slotDurationMinutes;

    @Value("${booking.max-advance-days:7}")
    private int maxAdvanceDays;

    @Value("${booking.operating-hours.start:6}")
    private int operatingHourStart;

    @Value("${booking.operating-hours.end:23}")
    private int operatingHourEnd;

    // ─── Create Booking ──────────────────────────────────────────────

    @Transactional
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        log.info("Creating booking for userId: {}, stationId: {}, slot: {} - {}",
                userId, request.getStationId(), request.getSlotStartTime(), request.getSlotEndTime());

        // Validate time slot
        validateTimeSlot(request);

        // Fetch station info via Feign
        String stationName = fetchStationName(request.getStationId());

        // Acquire distributed lock to prevent double-booking
        String lockKey = "booking:lock:" + request.getStationId() + ":" +
                request.getSlotStartTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        RLock lock = redissonClient.getLock(lockKey);

        try {
            boolean locked = lock.tryLock(5, 10, TimeUnit.SECONDS);
            if (!locked) {
                throw new SlotUnavailableException("Unable to acquire lock. Slot may be under concurrent booking.");
            }

            // Check for overlapping bookings
            List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                    request.getStationId(), request.getSlotStartTime(), request.getSlotEndTime());
            if (!overlapping.isEmpty()) {
                throw new SlotUnavailableException(
                        "Slot is already booked for station " + request.getStationId() +
                                " from " + request.getSlotStartTime() + " to " + request.getSlotEndTime());
            }

            // Create booking entity
            Booking booking = bookingMapper.toEntity(request);
            booking.setUserId(userId);
            booking.setStationName(stationName);
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setEstimatedCost(calculateEstimatedCost(request));

            Booking saved = bookingRepository.save(booking);
            log.info("Booking created successfully: id={}", saved.getId());

            // Publish Kafka events
            BookingEvent event = buildBookingEvent(saved, "CONFIRMED");
            eventProducer.publishBookingCreated(event);
            eventProducer.publishBookingConfirmed(event);

            return bookingMapper.toResponse(saved);

        } catch (InterruptedException e) {

Thread.currentThread().interrupt();
            throw new SlotUnavailableException("Booking interrupted. Please try again.");
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    // ─── Cancel Booking ──────────────────────────────────────────────

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        log.info("Cancelling booking: id={}, userId={}", bookingId, userId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only cancel your own bookings");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled");
        }

        if (booking.getSlotStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot cancel a booking that has already started");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        log.info("Booking cancelled successfully: id={}", saved.getId());

        // Publish cancellation event
        eventProducer.publishBookingCancelled(buildBookingEvent(saved, "CANCELLED"));

        return bookingMapper.toResponse(saved);
    }

    // ─── Get Booking by ID ───────────────────────────────────────────

    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));
        return bookingMapper.toResponse(booking);
    }

    // ─── Get User Bookings ──────────────────────────────────────────

    public Page<BookingResponse> getUserBookings(Long userId, Pageable pageable) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(bookingMapper::toResponse);
    }

    // ─── Slot Availability ──────────────────────────────────────────

    public SlotAvailabilityResponse getSlotAvailability(Long stationId, String dateStr) {
        LocalDate date = LocalDate.parse(dateStr);
        String stationName = fetchStationName(stationId);

        LocalDateTime dayStart = date.atTime(operatingHourStart, 0);
        LocalDateTime dayEnd = date.atTime(operatingHourEnd, 0);

        // Get existing bookings for this station on this date
        List<Booking> existingBookings = bookingRepository.findBookingsForStationOnDate(
                stationId, dayStart, dayEnd);

        // Generate all possible slots and mark availability
        List<SlotAvailabilityResponse.TimeSlot> allSlots = new ArrayList<>();
        List<SlotAvailabilityResponse.TimeSlot> availableSlots = new ArrayList<>();
        List<SlotAvailabilityResponse.TimeSlot> bookedSlots = new ArrayList<>();

        LocalDateTime slotStart = dayStart;
        while (slotStart.plusMinutes(slotDurationMinutes).compareTo(dayEnd) <= 0) {
            LocalDateTime slotEnd = slotStart.plusMinutes(slotDurationMinutes);
            final LocalDateTime checkStart = slotStart;
            final LocalDateTime checkEnd = slotEnd;

            boolean isBooked = existingBookings.stream()
                    .anyMatch(b -> b.getSlotStartTime().isBefore(checkEnd) && b.getSlotEndTime().isAfter(checkStart));

            boolean isPast = slotStart.isBefore(LocalDateTime.now());

            SlotAvailabilityResponse.TimeSlot slot = SlotAvailabilityResponse.TimeSlot.builder()
                    .startTime(slotStart)
                    .endTime(slotEnd)
                    .available(!isBooked && !isPast)
                    .build();

            allSlots.add(slot);
            if (!isBooked && !isPast) {
                availableSlots.add(slot);
            } else if (isBooked) {
                bookedSlots.add(slot);

}

            slotStart = slotEnd;
        }

        return SlotAvailabilityResponse.builder()
                .stationId(stationId)
                .stationName(stationName)
                .date(dateStr)
                .availableSlots(availableSlots)
                .bookedSlots(bookedSlots)
                .build();
    }

    // ─── Private Helpers ─────────────────────────────────────────────

    private void validateTimeSlot(BookingRequest request) {
        if (request.getSlotEndTime().isBefore(request.getSlotStartTime()) ||
                request.getSlotEndTime().equals(request.getSlotStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        LocalDateTime maxDate = LocalDateTime.now().plusDays(maxAdvanceDays);
        if (request.getSlotStartTime().isAfter(maxDate)) {
            throw new IllegalArgumentException("Cannot book more than " + maxAdvanceDays + " days in advance");
        }

        int startHour = request.getSlotStartTime().getHour();
        int endHour = request.getSlotEndTime().getHour();
        if (startHour < operatingHourStart || endHour > operatingHourEnd) {
            throw new IllegalArgumentException(
                    "Booking must be within operating hours: " + operatingHourStart + ":00 - " + operatingHourEnd
                            + ":00");
        }
    }

    private String fetchStationName(Long stationId) {
        try {
            Map<String, Object> station = stationClient.getStationById(stationId);
            return station != null && station.get("name") != null
                    ? station.get("name").toString()
                    : "Station #" + stationId;
        } catch (Exception e) {
            log.warn("Could not fetch station name for id: {}. Using default.", stationId);
            return "Station #" + stationId;
        }
    }

    private Double calculateEstimatedCost(BookingRequest request) {
        long durationMinutes = java.time.Duration.between(
                request.getSlotStartTime(), request.getSlotEndTime()).toMinutes();
        // Base rate: ₹5 per minute for 4W, ₹3 for 2W
        double ratePerMinute = "TWO_WHEELER".equals(request.getVehicleType()) ? 3.0 : 5.0;
        return durationMinutes * ratePerMinute;
    }

    private BookingEvent buildBookingEvent(Booking booking, String status) {
        return BookingEvent.builder()
                .bookingId(booking.getId())
                .userId(booking.getUserId())
                .stationId(booking.getStationId())
                .stationName(booking.getStationName())
                .slotStartTime(booking.getSlotStartTime())
                .slotEndTime(booking.getSlotEndTime())
                .status(status)
                .vehicleType(booking.getVehicleType())
                .estimatedCost(booking.getEstimatedCost())
                .eventTimestamp(LocalDateTime.now())
                .build();
    }
    
    // Recovery for confirmBooking since it was added recently!
    @Transactional
    public BookingResponse confirmBooking(Long bookingId) {
        log.info("Confirming booking id: {}", bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found: " + bookingId));
        
        booking.setStatus(BookingStatus.CONFIRMED);
        Booking saved = bookingRepository.save(booking);
        
        eventProducer.publishBookingConfirmed(buildBookingEvent(saved, "CONFIRMED"));
        return bookingMapper.toResponse(saved);
    }
}
