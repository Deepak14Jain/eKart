package com.group4.eKart.service;
import com.group4.eKart.model.Product;
import com.group4.eKart.repository.ProductRepository;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private FeedbackValidations feedbackValidations;

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public Feedback submitFeedback(Profile profile, Product product, String comment) {
        return submitFeedback(profile, product, comment, null); // Delegate to new method
    }

    @Override
    @Transactional
    public Feedback submitFeedback(Profile profile, Product product, String comment, Integer rating) {
        feedbackValidations.validateProfile(profile);
        feedbackValidations.validateComment(comment);

        Feedback newFeedback = new Feedback();
        newFeedback.setDate(LocalDateTime.now());
        newFeedback.setComment(comment);
        newFeedback.setProfile(profile);
        newFeedback.setProduct(product);
        newFeedback.setRating(rating);

        // Only save feedback, do not save profile/product or add to their lists
        return feedbackRepository.save(newFeedback);
    }

    @Override
    public List<Feedback> getFeedbackByUser(UUID profileId) {
        return feedbackRepository.findAllByProfileProfileId(profileId);
    }

    @Override
    public List<Feedback> getFeedbackByProduct(UUID productId) {
        return feedbackRepository.findAllByProductProductId(productId);
    }

    public Map<UUID, Feedback> getUserFeedbackForOrderedProducts(UUID profileId, List<UUID> orderedProductIds) {
        List<Feedback> userFeedbacks = feedbackRepository.findAllByProfileProfileId(profileId);
        Map<UUID, Feedback> feedbackMap = new HashMap<>();
        for (Feedback feedback : userFeedbacks) {
            UUID productId = feedback.getProduct() != null ? feedback.getProduct().getProductId() : null;
            if (productId != null && orderedProductIds.contains(productId)) {
                feedbackMap.put(productId, feedback);
            }
        }
        return feedbackMap; // productId -> Feedback (if exists)
    }
}
