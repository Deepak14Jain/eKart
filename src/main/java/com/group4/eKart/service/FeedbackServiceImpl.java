package com.group4.eKart.service;
import com.group4.eKart.validator.FeedbackValidations;
import com.group4.eKart.model.Feedback;
import com.group4.eKart.model.Profile;
import com.group4.eKart.repository.FeedbackRepository;
import com.group4.eKart.repository.ProfileRepository;
import com.group4.eKart.validator.FeedbackValidations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private FeedbackValidations feedbackValidations;

    @Override
    @Transactional
    public Feedback submitFeedback(Profile profile, String comment) {
        // Validate inputs
        feedbackValidations.validateProfile(profile);
        feedbackValidations.validateComment(comment);

        // Create and save feedback
        Feedback newFeedback = new Feedback();
        newFeedback.setDate(LocalDateTime.now());
        newFeedback.setComment(comment);
        newFeedback.setProfile(profile);

        // Link feedback with user profile
        profile.getFeedbacks().add(newFeedback);
        profileRepository.save(profile); // Optional if cascade is enabled

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
