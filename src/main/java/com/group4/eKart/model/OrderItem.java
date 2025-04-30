package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID OrderItemId;

    @ManyToOne
    private Product product;

    @ManyToOne
    private BillingOrder billingOrder;

    private int quantity;
    private double priceAtOrderTime;
}
