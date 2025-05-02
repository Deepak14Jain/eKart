package com.group4.eKart.repository;

import com.group4.eKart.model.BillingOrder;
import com.group4.eKart.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BillingOrderRepository extends JpaRepository<BillingOrder, UUID> {
    List<BillingOrder> findByProfileUsername(String username);
}
