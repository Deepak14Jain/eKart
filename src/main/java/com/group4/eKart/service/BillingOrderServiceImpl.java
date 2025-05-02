package com.group4.eKart.service;

import com.group4.eKart.model.*;
import com.group4.eKart.repository.BillingOrderRepository;
import com.group4.eKart.repository.CartItemRepository;
import com.group4.eKart.repository.OrderItemRepository;
import com.group4.eKart.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BillingOrderServiceImpl implements BillingOrderService {
    @Autowired
    BillingOrderRepository billingOrderRepository;

    @Autowired
    CartItemRepository cartItemRepository;

    @Autowired
    OrderItemServiceImpl orderItemService;

    @Override
    @Transactional
    public BillingOrder placeInstantOrder(Profile profile, Product product, int quantity) {
        BillingOrder billingOrder = new BillingOrder();

        if (product.getQuantityOnHand() < quantity) {
            throw new IllegalStateException("Available stock for " + product.getName() + ": " + product.getQuantityOnHand());
        }
        product.setQuantityOnHand(product.getQuantityOnHand() - quantity);

        OrderItem orderItem = orderItemService.createNewOrderItem(billingOrder, product, quantity);
        billingOrder.setProfile(profile);
        billingOrder.getItems().add(orderItem);
        billingOrder.setOrderDate(LocalDateTime.now());
        billingOrderRepository.save(billingOrder);
        return billingOrder;
    }

    @Override
    @Transactional
    public BillingOrder placeOrder(Profile profile) {
        List<CartItem> cartItems = cartItemRepository.findByProfileUsername(profile.getUsername());

        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cart is empty. Cannot place order.");
        }

        BillingOrder billingOrder = new BillingOrder();
        billingOrder.setProfile(profile);
        billingOrder.setOrderDate(LocalDateTime.now());

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            if (product.getQuantityOnHand() < cartItem.getQuantity()) {
                throw new IllegalStateException("Available stock for " + product.getName() + ": " + product.getQuantityOnHand());
            }

            product.setQuantityOnHand(product.getQuantityOnHand() - cartItem.getQuantity());

            OrderItem orderItem = orderItemService.createNewOrderItem(billingOrder, product, cartItem.getQuantity());
            billingOrder.getItems().add(orderItem);
        }
        billingOrderRepository.save(billingOrder);
        cartItemRepository.deleteByProfileUsername(profile.getUsername());

        return billingOrder;
    }

    @Override
    public BillingOrder getOrderById(UUID billingOrderId) {
        return billingOrderRepository.findById(billingOrderId).get();
    }

    @Override
    public List<BillingOrder> getOrdersByProfile(String username) {
        return billingOrderRepository.findByProfileUsername(username);
    }

    @Override
    public boolean cancelOrder(String username, UUID billingOrderId) {
        BillingOrder billingOrder = billingOrderRepository.findById(billingOrderId).get();
        billingOrder.setBillingOrderStatus(BillingOrderStatus.CANCELLED);
        billingOrderRepository.save(billingOrder);
        return true;
    }

    @Override
    public List<BillingOrder> getAllOrders() {
        return billingOrderRepository.findAll();
    }
}
