package com.evcharge.session.repository;

import com.evcharge.session.entity.ChargingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChargingSessionRepository extends JpaRepository<ChargingSession, Long> {
    List<ChargingSession> findByUserIdAndStatus(Long userId, String status);

    Optional<ChargingSession> findByTransactionId(String transactionId);

    List<ChargingSession> findByStatus(String status);
}
