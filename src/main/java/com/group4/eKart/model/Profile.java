package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Indexed;

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
    @Column(unique = true, nullable = false)
    private String username;
    @Column(nullable = false)
    private String password;
    private String address;
    private String phno;
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private Roles role;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Feedback> feedbacks;
}
