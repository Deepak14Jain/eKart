package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID feedbackId;

    @ManyToOne
    private Profile profile;

    @Column(nullable = false)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime date;

}
