package com.evcharge.analytics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RevenueReportDto {
    private Double totalRevenue;
    private String currency;
    private String period;
}
