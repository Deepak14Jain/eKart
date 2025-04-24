package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.Data;


import java.util.UUID;

@Entity
@Data
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID cartItemId;

    @ManyToOne
    private User user;

    @ManyToOne
    private Product product;

    private int quantity;
}
