package com.group4.eKart.service;

import com.group4.eKart.model.CartItem;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface CartItemService {
    public CartItem addToCart(UUID userId, UUID productId, int quantity);
    public CartItem updateCartItem(UUID cartItemId, int newQuantity);
    public boolean removeFromCart(UUID cartItemId);
    public List<CartItem> getCartItemsByUser(UUID userId);
    public boolean clearCart(UUID userId);
}
