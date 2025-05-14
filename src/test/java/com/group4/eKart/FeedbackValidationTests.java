package com.group4.eKart;
import com.group4.eKart.model.Profile;
import com.group4.eKart.validator.FeedbackValidations;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class FeedbackValidationsTest {

    private FeedbackValidations feedbackValidations;

    @BeforeEach
    void setUp() {
        feedbackValidations = new FeedbackValidations();
    }

    // --- validateProfile tests ---
    @Test
    void testValidateProfile_validProfile_shouldPass() {
        Profile profile = new Profile();
        profile.setProfileId(UUID.randomUUID());

        assertDoesNotThrow(() -> feedbackValidations.validateProfile(profile));
    }

    @Test
    void testValidateProfile_nullProfile_shouldThrowException() {
        Exception exception = assertThrows(IllegalArgumentException.class,
                () -> feedbackValidations.validateProfile(null));

        assertEquals("Invalid profile. Profile cannot be null.", exception.getMessage());
    }

    @Test
    void testValidateProfile_profileWithNullId_shouldThrowException() {
        Profile profile = new Profile();

        Exception exception = assertThrows(IllegalArgumentException.class,
                () -> feedbackValidations.validateProfile(profile));

        assertEquals("Invalid profile. Profile cannot be null.", exception.getMessage());
    }

    // --- validateComment tests ---
    @Test
    void testValidateComment_validComment_shouldPass() {
        assertDoesNotThrow(() -> feedbackValidations.validateComment("Great product!"));
    }

    @Test
    void testValidateComment_emptyComment_shouldThrowException() {
        Exception exception = assertThrows(IllegalArgumentException.class,
                () -> feedbackValidations.validateComment("  "));

        assertEquals("Comment cannot be empty.", exception.getMessage());
    }

    @Test
    void testValidateComment_nullComment_shouldThrowException() {
        Exception exception = assertThrows(IllegalArgumentException.class,
                () -> feedbackValidations.validateComment(null));

        assertEquals("Comment cannot be empty.", exception.getMessage());
    }

    @Test
    void testValidateComment_exceedsMaxLength_shouldThrowException() {
        String longComment = "a".repeat(501); // 501 characters

        Exception exception = assertThrows(IllegalArgumentException.class,
                () -> feedbackValidations.validateComment(longComment));

        assertEquals("Comment is too long. Maximum 500 characters allowed.", exception.getMessage());
    }
}
