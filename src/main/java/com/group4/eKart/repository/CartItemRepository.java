package com.group4.eKart.repository;

import com.group4.eKart.model.CartItem;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    Optional<CartItem> findByProfileAndProduct(Profile profile, Product product);
    List<CartItem> findByProfileUsername(String username);
    void deleteByProfileUsername(String username);

}
