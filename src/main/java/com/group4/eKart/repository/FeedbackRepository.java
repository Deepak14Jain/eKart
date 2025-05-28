package com.group4.eKart.repository;

import com.group4.eKart.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {
    List<Feedback> findAllByProfileProfileId(UUID profileId); // Maps to profile_id
    List<Feedback> findAllByProductProductId(UUID productId); // Maps to product_id
}
