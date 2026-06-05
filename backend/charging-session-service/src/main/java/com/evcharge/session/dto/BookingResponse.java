// 📁 com.evcharge.session.dto.BookingResponse.java

package com.evcharge.session.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private Long userId;
    // 👇 add remaining fields — scroll down in your booking-service
    // to see if there are more fields below line 27
    private LocalDateTime slotStartTime;
    private LocalDateTime slotEndTime;
    private String vehicleType;
    private String connectorType;
    private Double estimatedCost;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
