package com.group4.eKart.service;

import com.group4.eKart.model.BillingOrder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface BillingOrderService {
    public BillingOrder placeOrder(UUID profileId);
    public BillingOrder getOrderById(UUID orderId);
    public List<BillingOrder> getOrdersByProfile(UUID profileId);
    public boolean cancelOrder(UUID orderId);
    public List<BillingOrder> getAllOrders();
}
