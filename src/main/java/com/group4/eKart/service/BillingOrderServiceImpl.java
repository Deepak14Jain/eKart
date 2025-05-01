package com.group4.eKart.service;

import com.group4.eKart.model.BillingOrder;

import java.util.List;
import java.util.UUID;

public class BillingOrderServiceImpl implements BillingOrderService {
    @Override
    public BillingOrder placeOrder(UUID profileId) {
        return null;
    }

    @Override
    public BillingOrder getOrderById(UUID orderId) {
        return null;
    }

    @Override
    public List<BillingOrder> getOrdersByProfile(UUID profileId) {
        return List.of();
    }

    @Override
    public boolean cancelOrder(UUID orderId) {
        return false;
    }

    @Override
    public List<BillingOrder> getAllOrders() {
        return List.of();
    }
}
