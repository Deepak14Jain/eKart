package com.group4.eKart.service;

import com.group4.eKart.model.CartItem;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.Profile;
import com.group4.eKart.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartItemServiceImpl implements CartItemService {
    @Autowired
    CartItemRepository cartItemRepository;

    @Override
    public CartItem getCartItemById(UUID cartItemId) {
        return cartItemRepository.findById(cartItemId).get();
    }

    @Override
    public CartItem addToCart(Profile profile, Product product, int quantity) {
        Optional<CartItem> existingItemOpt = cartItemRepository.findByProfileAndProduct(profile, product);

        CartItem cartItem;
        if (existingItemOpt.isPresent()) {
            cartItem = updateCartItem(existingItemOpt.get().getCartItemId(), quantity);
        } else {
            cartItem = new CartItem();
            cartItem.setProfile(profile);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        return cartItem;
    }

    @Override
    public CartItem updateCartItem(UUID cartItemId, int newQuantity) {
        CartItem updatedCartItem = getCartItemById(cartItemId);
        updatedCartItem.setQuantity(updatedCartItem.getQuantity()+newQuantity);
        cartItemRepository.save(updatedCartItem);
        return updatedCartItem;
    }

    @Override
    public boolean removeFromCart(Profile profile, UUID cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId).get();
        if(cartItem.getProfile() == profile) {
            cartItemRepository.deleteById(cartItemId);
            return true;
        }
        return false;
    }

    @Override
    public List<CartItem> getCartItemsByUser(String username) {
        return cartItemRepository.findByProfileUsername(username);
    }

    @Override
    public boolean clearCart(String username) {
        List<CartItem> items = cartItemRepository.findByProfileUsername(username);

        if (items.isEmpty()) {
            return false;
        }

        cartItemRepository.deleteByProfileUsername(username);
        return true;
    }
}
