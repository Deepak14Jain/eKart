package com.group4.eKart.service;

import com.group4.eKart.dto.OrderResponseDTO;
import com.group4.eKart.model.BillingOrder;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.Profile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface BillingOrderService {
    public BillingOrder placeInstantOrder(Profile profile, Product product, int quantity);
    public BillingOrder placeOrder(Profile profile);
    public BillingOrder getOrderById(UUID billingOrderId);
    public List<OrderResponseDTO> getOrdersByProfile(String username);
    public boolean cancelOrder(String username, UUID billingOrderId);
    public List<OrderResponseDTO> getAllOrders();
}
