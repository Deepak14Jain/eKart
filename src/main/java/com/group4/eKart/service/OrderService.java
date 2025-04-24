package com.group4.eKart.service;

import com.group4.eKart.model.Order;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface OrderService {
    public Order placeOrder(UUID userId);
    public Order getOrderById(UUID orderId);
    public List<Order> getOrdersByUser(UUID userId);
    public void cancelOrder(UUID orderId);
    public List<Order> getAllOrders(); // Admin view
}
