package com.group4.eKart.service;

import com.group4.eKart.model.Feedback;
import com.group4.eKart.model.Profile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface FeedbackService {
    public Feedback submitFeedback(Profile profile, String comment);
    public List<Feedback> getFeedbackByUser(UUID userId);
    public List<Feedback> getAllFeedback(); // For admin
}
