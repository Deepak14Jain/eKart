package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Indexed;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "profiles") // Ensure the table name matches the database schema
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID profileId;

    @Column(unique = true, nullable = false)
    private String username; // Keep username for login purposes

    @Column(unique = true, nullable = false)
    private String email; // Add email field

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name; // Full name

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Roles role;

    @Column(nullable = false)
    private String phno; // Phone number

    @Column(nullable = false)
    private String address; // Address

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Feedback> feedbacks = new HashSet<>();
}
