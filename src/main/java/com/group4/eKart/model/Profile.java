package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID profileId;
    private String username;
    private String password;
    private String address;
    private String phno;
    private String name;

    @Enumerated(EnumType.STRING)
    private Roles role;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Feedback> feedbacks;
}
