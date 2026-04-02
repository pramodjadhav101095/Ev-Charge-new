package com.evcharge.booking.mapper;

import com.evcharge.booking.dto.BookingRequest;
import com.evcharge.booking.dto.BookingResponse;
import com.evcharge.booking.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    BookingResponse toResponse(Booking booking);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "stationName", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "estimatedCost", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    Booking toEntity(BookingRequest request);
}
