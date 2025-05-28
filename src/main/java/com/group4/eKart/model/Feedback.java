package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "feedbacks")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID feedbackId;

    @ManyToOne
    @JoinColumn(name = "profile_id") // Maps to the profile_id column
    private Profile profile;

    @ManyToOne
    @JoinColumn(name = "product_id") // Maps to the product_id column
    private Product product;

    @Column(nullable = false)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime date; // Ensure this field is mapped correctly

    @Column
    private Integer rating; // Optional rating field
}
