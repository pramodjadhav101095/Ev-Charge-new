package com.evcharge.analytics.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class SessionTrendDto {
    private Map<String, Long> trends; // Date -> Session count
    private String period;
}
