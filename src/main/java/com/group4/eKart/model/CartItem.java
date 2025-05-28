package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID cartItemId;

    @ManyToOne
    @JoinColumn(name = "profile_id", nullable = false) // Correct column name for profile
    private Profile profile;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false) // Correct column name for product
    private Product product;

    @Column(nullable = false)
    private int quantity;
}
