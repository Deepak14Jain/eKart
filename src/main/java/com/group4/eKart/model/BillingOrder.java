package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BillingOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID billingOrderId;

    @ManyToOne
    private Profile profile;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @OneToMany(mappedBy = "billingOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItem> items = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillingOrderStatus billingOrderStatus = BillingOrderStatus.PENDING;
}
