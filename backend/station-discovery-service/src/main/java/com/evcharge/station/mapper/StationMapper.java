package com.evcharge.station.mapper;

import com.evcharge.station.dto.StationDto;
import com.evcharge.station.entity.ChargingStation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface StationMapper {

    // StationMapper INSTANCE = Mappers.getMapper(StationMapper.class);

    @Mapping(target = "distance", ignore = true)
    @Mapping(target = "source", ignore = true)
    @Mapping(target = "duration", ignore = true)
    StationDto toDto(ChargingStation station);

    ChargingStation toEntity(StationDto dto);
}
