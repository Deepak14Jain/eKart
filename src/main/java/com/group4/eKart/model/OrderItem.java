package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID OrderItemId;

    @ManyToOne
    private Product product;

    private int quantity;
    private double priceAtOrderTime;
}
