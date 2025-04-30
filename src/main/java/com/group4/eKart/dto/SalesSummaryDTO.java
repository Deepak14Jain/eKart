package com.group4.eKart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalesSummaryDTO {
    private String name; // product name or category
    private Long totalQuantity;
    private Double totalRevenue;
}
