package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillingOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID OrderId;

    @ManyToOne
    private Profile profile;

    private LocalDateTime orderDate;

    @OneToMany(mappedBy = "billingOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;
}
