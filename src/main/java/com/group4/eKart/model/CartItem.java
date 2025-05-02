package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID cartItemId;

    @ManyToOne
    private Profile profile;

    @ManyToOne
    private Product product;

    @Column(nullable = false)
    private int quantity;
}
