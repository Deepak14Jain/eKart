package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID productId;
    private String name;
    private String description;
    private double price;
    private int quantityOnHand;
    @Enumerated(EnumType.STRING)
    private ProductCategory productCategory;
}
