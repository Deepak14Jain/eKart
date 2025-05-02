package com.group4.eKart.service;

import com.group4.eKart.model.Feedback;
import com.group4.eKart.model.Profile;
import com.group4.eKart.repository.FeedbackRepository;
import com.group4.eKart.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FeedbackServiceImpl implements FeedbackService {
    @Autowired
    FeedbackRepository feedbackRepository;

    @Autowired
    ProfileRepository profileRepository;

    @Override
    @Transactional
    public Feedback submitFeedback(Profile profile, String comment) {
        Feedback newFeedback = new Feedback();
        newFeedback.setDate(LocalDateTime.now());
        newFeedback.setComment(comment);
        newFeedback.setProfile(profile);

        profile.getFeedbacks().add(newFeedback);
        profileRepository.save(profile);

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
