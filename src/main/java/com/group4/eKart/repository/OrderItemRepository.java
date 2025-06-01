package com.group4.eKart.repository;

import com.group4.eKart.dto.SalesSummaryDTO;
import com.group4.eKart.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    @Query("SELECT new com.group4.eKart.dto.SalesSummaryDTO(p.name, SUM(oi.quantity), SUM(oi.quantity * oi.priceAtOrderTime)) " +
            "FROM OrderItem oi JOIN oi.product p JOIN oi.billingOrder bo " +
            "WHERE bo.orderDate BETWEEN :startDate AND :endDate " +
            "GROUP BY p.name")
    List<SalesSummaryDTO> getProductWiseSalesBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT new com.group4.eKart.dto.SalesSummaryDTO(CAST(p.productCategory as string), SUM(oi.quantity), SUM(oi.quantity * oi.priceAtOrderTime)) " +
            "FROM OrderItem oi JOIN oi.product p JOIN oi.billingOrder bo " +
            "WHERE bo.orderDate BETWEEN :startDate AND :endDate " +
            "GROUP BY p.productCategory")
    List<SalesSummaryDTO> getCategoryWiseSalesBetween(LocalDateTime startDate, LocalDateTime endDate);
}
