package com.group4.eKart.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID feedbackId;

    @ManyToOne
    private User user;

    private String comment;
    private LocalDateTime date;

}
