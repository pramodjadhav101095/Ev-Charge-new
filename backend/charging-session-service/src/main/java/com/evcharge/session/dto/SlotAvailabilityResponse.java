// 📁 com.evcharge.session.dto.SlotAvailabilityResponse.java

package com.evcharge.session.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotAvailabilityResponse {
    private Long stationId;
    private String date;
    private List<String> availableSlots; // adjust based on actual fields
}