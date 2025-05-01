package com.group4.eKart.service;

import com.group4.eKart.model.CartItem;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.Profile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface CartItemService {
    public CartItem getCartItemById(UUID cartItemId);
    public CartItem addToCart(Profile profile, Product product, int quantity);
    public CartItem updateCartItem(UUID cartItemId, int newQuantity);
    public boolean removeFromCart(Profile profile, UUID cartItemId);
    public List<CartItem> getCartItemsByUser(String username);
    public boolean clearCart(String username);
}
