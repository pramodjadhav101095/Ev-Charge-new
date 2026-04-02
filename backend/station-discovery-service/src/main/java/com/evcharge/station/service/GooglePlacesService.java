package com.evcharge.station.service;

import com.evcharge.station.dto.StationDto;
import com.evcharge.station.entity.StationStatus;
import com.google.maps.DistanceMatrixApi;
import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.google.maps.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class GooglePlacesService {

    private final GeoApiContext context;

    public CompletableFuture<List<StationDto>> findNearbyEvChargers(double lat, double lon, int radiusMeters) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                LatLng location = new LatLng(lat, lon);

                // Using Places API to search for EV charging stations
                PlacesSearchResponse response = PlacesApi.nearbySearchQuery(context, location)
                        .radius(radiusMeters)
                        .keyword("EV Charging Station")
                        .await();

                List<StationDto> stations = new ArrayList<>();
                if (response.results != null) {
                    for (PlacesSearchResult result : response.results) {
                        stations.add(mapToDto(result));
                    }
                }
                return stations;
            } catch (Exception e) {
                log.error("Error fetching data from Google Places API", e);
                return new ArrayList<>();
            }
        });
    }

    /**
     * Updates a list of stations with driving distance and duration using Distance
     * Matrix API.
     */
    public CompletableFuture<Void> updateDistances(double originLat, double originLon, List<StationDto> stations) {
        if (stations == null || stations.isEmpty()) {
            return CompletableFuture.completedFuture(null);
        }

        return CompletableFuture.runAsync(() -> {
            try {
                LatLng origin = new LatLng(originLat, originLon);
                String[] destinations = stations.stream()
                        .map(s -> s.getLatitude() + "," + s.getLongitude())
                        .toArray(String[]::new);

                DistanceMatrix matrix = DistanceMatrixApi.getDistanceMatrix(context,
                        new String[] { origin.toString() },
                        destinations)
                        .await();

                if (matrix.rows != null && matrix.rows.length > 0) {
                    DistanceMatrixElement[] elements = matrix.rows[0].elements;
                    for (int i = 0; i < elements.length && i < stations.size(); i++) {
                        if (elements[i].status == DistanceMatrixElementStatus.OK) {
                            stations.get(i).setDistance((double) elements[i].distance.inMeters / 1000.0); // Convert to
                                                                                                          // KM
                            stations.get(i).setDuration(elements[i].duration.humanReadable);
                        }
                    }
                }
            } catch (Exception e) {
                log.error("Error fetching data from Google Distance Matrix API", e);
            }
        });
    }

    private StationDto mapToDto(PlacesSearchResult result) {
        StationDto dto = new StationDto();
        dto.setName(result.name);
        dto.setLatitude(result.geometry.location.lat);
        dto.setLongitude(result.geometry.location.lng);
        dto.setAddress(result.vicinity);
        dto.setStatus(StationStatus.AVAILABLE);
        dto.setType("GOOGLE_SOURCE");
        dto.setSource("GOOGLE");
        return dto;
    }
}
