package com.evcharge.station.service;

import com.evcharge.station.dto.StationDto;
import com.evcharge.station.entity.ChargingStation;
import com.evcharge.station.entity.StationStatus;
import com.evcharge.station.kafka.StationKafkaProducer;
import com.evcharge.station.mapper.StationMapper;
import com.evcharge.station.repository.ChargingStationRepository;
import com.evcharge.station.repository.StationGeoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StationService {

    private final ChargingStationRepository repository;
    private final StationGeoRepository geoRepository;
    private final StationMapper mapper;
    private final StationKafkaProducer kafkaProducer;
    private final GooglePlacesService googlePlacesService;

    @Transactional
    public StationDto createStation(StationDto dto) {
        ChargingStation station = mapper.toEntity(dto);
        station.setStatus(StationStatus.AVAILABLE);
        station = repository.save(station);

        // Update Redis Geo-Spatial index
        geoRepository.save(station.getId(), station.getLatitude(), station.getLongitude());

        StationDto response = mapper.toDto(station);
        kafkaProducer.sendStationCreated(response);
        return response;
    }

    @Transactional
    public StationDto updateStationStatus(Long id, StationStatus status) {
        ChargingStation station = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found: " + id));
        station.setStatus(status);
        station = repository.save(station);

        kafkaProducer.sendStationStatusChanged(id, status.name());
        return mapper.toDto(station);
    }

    public List<StationDto> findNearby(double lat, double lon, double radius) {
        // 1. Fetch from Redis (Internal)
        GeoResults<RedisGeoCommands.GeoLocation<Object>> results = geoRepository.findNearby(lat, lon, radius);

        List<StationDto> internalStations = results.getContent().stream().map(result -> {
            Long id = Long.parseLong(result.getContent().getName().toString());
            ChargingStation station = repository.findById(id).orElse(null);
            if (station == null)
                return null;

            StationDto dto = mapper.toDto(station);
            dto.setDistance(result.getDistance().getValue());
            dto.setSource("INTERNAL");
            return dto;
        }).filter(dto -> dto != null).collect(Collectors.toCollection(ArrayList::new));

        // 2. Fetch from Google (External) - Radius in meters for Google API
        try {
            List<StationDto> googleStations = googlePlacesService.findNearbyEvChargers(lat, lon, (int) (radius * 1000))
                    .get();
            googleStations.forEach(s -> s.setSource("GOOGLE"));
            internalStations.addAll(googleStations);
        } catch (Exception e) {
            log.error("Error fetching Google Places results", e);
        }

        // 3. Update all results with real driving distance and duration
        try {
            googlePlacesService.updateDistances(lat, lon, internalStations).get();
        } catch (Exception e) {
            log.error("Error updating driving distances", e);
        }

        return internalStations;
    }

    public StationDto getStation(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("Station not found: " + id));
    }
}
