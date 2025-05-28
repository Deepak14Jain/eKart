package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "billing_orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BillingOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID billingOrderId;

    @ManyToOne
    @JoinColumn(name = "profile_id", nullable = false) // Correct column name for profile
    private Profile profile;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @OneToMany(mappedBy = "billingOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItem> items = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillingOrderStatus billingOrderStatus = BillingOrderStatus.PENDING;
}
