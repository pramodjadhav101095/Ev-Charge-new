package com.evcharge.booking.repository;

import com.evcharge.booking.entity.Booking;
import com.evcharge.booking.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Booking> findByStationIdAndStatusNot(Long stationId, BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.stationId = :stationId " +
            "AND b.status != 'CANCELLED' " +
            "AND b.slotStartTime < :endTime " +
            "AND b.slotEndTime > :startTime")
    List<Booking> findOverlappingBookings(
            @Param("stationId") Long stationId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    @Query("SELECT b FROM Booking b WHERE b.stationId = :stationId " +
            "AND b.status != 'CANCELLED' " +
            "AND b.slotStartTime >= :dayStart " +
            "AND b.slotStartTime < :dayEnd " +
            "ORDER BY b.slotStartTime")
    List<Booking> findBookingsForStationOnDate(
            @Param("stationId") Long stationId,
            @Param("dayStart") LocalDateTime dayStart,
            @Param("dayEnd") LocalDateTime dayEnd);

    long countByUserIdAndStatus(Long userId, BookingStatus status);
}
