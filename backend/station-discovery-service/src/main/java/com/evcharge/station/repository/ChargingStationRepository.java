package com.evcharge.station.repository;

import com.evcharge.station.entity.ChargingStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChargingStationRepository extends JpaRepository<ChargingStation, Long> {
    Optional<ChargingStation> findByOcppIdentity(String ocppIdentity);
}
