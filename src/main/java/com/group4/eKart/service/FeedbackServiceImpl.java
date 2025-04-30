package com.group4.eKart.service;

import com.group4.eKart.model.Feedback;
import com.group4.eKart.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class FeedbackServiceImpl implements FeedbackService {
    @Autowired
    FeedbackRepository feedbackRepository;

    @Override
    public Feedback submitFeedback(String comment) {
        Feedback newFeedback = new Feedback();
        newFeedback.setDate(LocalDateTime.now());
        newFeedback.setComment(comment);
        return feedbackRepository.save(newFeedback);
    }

    @Override
    public List<Feedback> getFeedbackByUser(UUID profileId) {
        return feedbackRepository.findAllByProfileProfileId(profileId);
    }

    @Override
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
}
