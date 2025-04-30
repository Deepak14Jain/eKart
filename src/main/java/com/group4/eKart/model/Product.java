package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID productId;
    private String name;
    private String description;
    private double price;
    private int quantityOnHand;
    @Enumerated(EnumType.STRING)
    private ProductCategory productCategory;
}
