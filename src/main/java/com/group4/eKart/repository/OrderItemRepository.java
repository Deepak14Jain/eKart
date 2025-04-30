package com.group4.eKart.repository;

import com.group4.eKart.dto.SalesSummaryDTO;
import com.group4.eKart.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    @Query("SELECT new com.group4.eKart.dto.SalesSummaryDTO(p.name, SUM(oi.quantity), SUM(oi.quantity * oi.priceAtOrderTime)) " +
            "FROM OrderItem oi JOIN oi.product p JOIN oi.billingOrder bo " +
            "WHERE bo.orderDate BETWEEN :startDate AND :endDate " +
            "GROUP BY p.name")
    List<SalesSummaryDTO> getProductWiseSalesBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT com.group4.eKart.dto.SalesSummaryDTO(p.productCategory, SUM(oi.quantity), SUM(oi.quantity * oi.priceAtOrderTime)) " +
            "FROM OrderItem oi JOIN oi.product p JOIN oi.billingOrder bo " +
            "WHERE bo.orderDate BETWEEN :startDate AND :endDate " +
            "GROUP BY p.productCategory")
    List<SalesSummaryDTO> getCategoryWiseSalesBetween(LocalDate startDate, LocalDate endDate);
}
