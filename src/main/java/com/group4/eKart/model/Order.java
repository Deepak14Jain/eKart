package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID OrderId;

    @ManyToOne
    private User user;

    private LocalDateTime orderDate;

    @OneToMany(cascade = CascadeType.ALL)
    private List<OrderItem> items;
}
