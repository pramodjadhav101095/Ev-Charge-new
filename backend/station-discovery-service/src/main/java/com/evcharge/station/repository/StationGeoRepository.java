package com.evcharge.station.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class StationGeoRepository {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String GEO_KEY = "station:locations";

    public void save(Long stationId, double lat, double lon) {
        redisTemplate.opsForGeo().add(GEO_KEY, new Point(lon, lat), stationId.toString());
    }

    public void remove(Long stationId) {
        redisTemplate.opsForZSet().remove(GEO_KEY, stationId.toString());
    }

    public GeoResults<RedisGeoCommands.GeoLocation<Object>> findNearby(double lat, double lon, double radiusKm) {
        Point point = new Point(lon, lat);
        Distance distance = new Distance(radiusKm, RedisGeoCommands.DistanceUnit.KILOMETERS);
        Circle circle = new Circle(point, distance);

        RedisGeoCommands.GeoRadiusCommandArgs args = RedisGeoCommands.GeoRadiusCommandArgs
                .newGeoRadiusArgs()
                .includeDistance()
                .sortAscending();

        return redisTemplate.opsForGeo().radius(GEO_KEY, circle, args);
    }
}
