package com.group4.eKart.validator;

import com.group4.eKart.model.Profile;
import org.springframework.stereotype.Component;

@Component
public class FeedbackValidations {

    public void validateProfile(Profile profile) {
        if (profile == null || profile.getProfileId() == null) {
            throw new IllegalArgumentException("Invalid profile. Profile cannot be null.");
        }
    }

    public void validateComment(String comment) {
        if (comment == null || comment.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment cannot be empty.");
        }

        if (comment.length() > 500) {
            throw new IllegalArgumentException("Comment is too long. Maximum 500 characters allowed.");
        }
    }
}
