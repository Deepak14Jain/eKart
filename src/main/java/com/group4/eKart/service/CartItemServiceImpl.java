package com.group4.eKart.service;

import com.group4.eKart.model.CartItem;
import com.group4.eKart.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

public class CartItemServiceImpl implements CartItemService {
    @Autowired
    CartItemRepository cartItemRepository;

    @Override
    public CartItem addToCart(UUID userId, UUID productId, int quantity) {
        return null;
    }

    @Override
    public CartItem updateCartItem(UUID cartItemId, int newQuantity) {
        return null;
    }

    @Override
    public boolean removeFromCart(UUID cartItemId) {
        return false;
    }

    @Override
    public List<CartItem> getCartItemsByUser(UUID userId) {
        return List.of();
    }

    @Override
    public boolean clearCart(UUID userId) {
        return false;
    }
}
