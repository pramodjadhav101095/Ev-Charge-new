package com.evcharge.station.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "charging_stations", indexes = {
        @Index(name = "idx_lat_long", columnList = "latitude, longitude")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChargingStation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StationStatus status;

    private String type; // AC, DC

    private String connectors; // JSON string or comma-separated list of connectors

    private String ocppIdentity; // Unique ID used for OCPP WebSocket communication
}
