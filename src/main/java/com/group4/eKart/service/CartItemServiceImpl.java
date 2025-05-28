package com.group4.eKart.service;

import com.group4.eKart.model.CartItem;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.Profile;
import com.group4.eKart.repository.CartItemRepository;
import com.group4.eKart.validator.CartItemValidations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartItemServiceImpl implements CartItemService {
    private static final Logger logger = LoggerFactory.getLogger(CartItemServiceImpl.class);

    private CartItemValidations cartItemValidations;

    @Autowired
    public CartItemServiceImpl(CartItemValidations cartItemValidations) {
        this.cartItemValidations = cartItemValidations;
    }

    @Autowired
    CartItemRepository cartItemRepository;

    @Override
    public CartItem getCartItemById(UUID cartItemId) {
        logger.debug("Inside getCartItemById method");
        return cartItemRepository.findById(cartItemId).get();
    }

    @Override
    public CartItem addToCart(Profile profile, Product product, int quantity) {
        logger.debug("Inside addToCart method");
        try{
            cartItemValidations.validateCartItem(profile, product, quantity);
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
        } catch (Exception exception) {
            logger.error("{}\nCould not add item to cart", exception.getMessage());
            return null;
        }

    }

    @Override
    public CartItem updateCartItem(UUID cartItemId, int newQuantity) {
        logger.debug("Inside updateCartItem method");
        try {
            CartItem updatedCartItem = getCartItemById(cartItemId);
            cartItemValidations.validateQuantity(newQuantity);
            updatedCartItem.setQuantity(newQuantity); // Set the quantity directly
            cartItemRepository.save(updatedCartItem);
            return updatedCartItem;
        } catch (Exception exception) {
            logger.error(exception.getMessage());
            return null;
        }

    }

    @Override
    public boolean removeFromCart(Profile profile, UUID cartItemId) {
        logger.debug("Inside removeFromCart method");
        CartItem cartItem = cartItemRepository.findById(cartItemId).get();
        if(cartItem.getProfile() == profile) {
            cartItemRepository.deleteById(cartItemId);
            return true;
        }
        return false;
    }

    @Override
    public List<CartItem> getCartItemsByUser(String username) {
        logger.debug("Inside getCartItemsByUser method");
        return cartItemRepository.findByProfileUsername(username);
    }

    @Override
    @Transactional
    public boolean clearCart(String username) {
        logger.debug("Inside clearCart method");
        List<CartItem> items = cartItemRepository.findByProfileUsername(username);

        if (items.isEmpty()) {
            return false;
        }

        cartItemRepository.deleteByProfileUsername(username);
        return true;
    }
}
