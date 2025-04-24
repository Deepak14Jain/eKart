package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;
    private String username;
    private String password;
    private String address;
    private String phno;
    private String name;

    @Enumerated(EnumType.STRING)
    private Roles role;
}
