package com.evcharge.station.dto;

import com.evcharge.station.entity.StationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StationDto {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String address;

    private StationStatus status;

    private String type;

    private String connectors;

    private String ocppIdentity;

    private Double distance; // Distance in search results

    private String duration; // Travel time duration (e.g. "5 mins")

    private String source; // INTERNAL or GOOGLE
}
