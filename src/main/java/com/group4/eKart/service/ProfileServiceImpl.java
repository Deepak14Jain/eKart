package com.group4.eKart.service;

import com.group4.eKart.model.Profile;
import com.group4.eKart.repository.ProfileRepository;
import com.group4.eKart.validator.ProfileValidations;
import org.hibernate.service.spi.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class ProfileServiceImpl implements ProfileService {
    private static final Logger logger = LoggerFactory.getLogger(ProfileServiceImpl.class);
    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final ProfileValidations profileValidations;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    public ProfileServiceImpl(ProfileValidations profileValidations) {
        this.profileValidations = profileValidations;
    }

    @Override
    public Profile registerProfile(Profile profile) throws ServiceException {
        logger.debug("Inside registerProfile method");
        try {
            logger.info("Validating profile...");
            profileValidations.validateProfile(profile);
            profileValidations.validateUsername(profile.getUsername()); // Validate username
            profileValidations.validateEmail(profile.getEmail()); // Validate email
            // Encode the password before saving
            profile.setPassword(passwordEncoder.encode(profile.getPassword()));
            return profileRepository.save(profile);
        } catch (Exception exception) {
            logger.error("{}\nProfile creation failed!", exception.getMessage());
            throw new ServiceException("Profile creation failed: " + exception.getMessage());
        }
    }

    @Override
    public Profile getUserById(UUID profileId) {
        logger.debug("Inside getUserById method");
        return profileRepository.findById(profileId).orElseThrow(() -> new ServiceException("Profile not found"));
    }

    @Override
    public List<Profile> getAllProfiles() {
        logger.debug("Inside getAllProfiles method");
        return profileRepository.findAll();
    }

    @Override
    public Profile updateProfile(Profile profile) {
        logger.debug("Inside updateProfile method");
        try {
            Profile updatedProfile = profileRepository.findById(profile.getProfileId()).orElseThrow(() -> new ServiceException("Profile not found"));
            updatedProfile.setName(profile.getName());
            profileValidations.validatePhone(profile.getPhno());
            updatedProfile.setPhno(profile.getPhno());
            updatedProfile.setAddress(profile.getAddress());
            profileRepository.save(updatedProfile);
            return updatedProfile;
        } catch (Exception exception) {
            logger.error("{}\nFailed to update profile!", exception.getMessage());
            throw new ServiceException("Failed to update profile: " + exception.getMessage());
        }
    }

    @Override
    public Profile findByUsername(String username) {
        logger.debug("Inside findByUsername method");
        Profile profile = profileRepository.findByUsername(username);
        if (profile == null) {
            throw new ServiceException("Username not found: " + username);
        }
        return profile;
    }

    @Override
    public boolean changePassword(UUID profileId, String oldPassword, String newPassword) {
        logger.debug("Inside changePassword method");
        try {
            Profile profile = profileRepository.findById(profileId).orElseThrow(() -> new ServiceException("Profile not found"));
            if (passwordEncoder.matches(oldPassword, profile.getPassword())) {
                profileValidations.validatePassword(newPassword);
                profile.setPassword(passwordEncoder.encode(newPassword));
                profileRepository.save(profile);
                return true;
            }
            logger.error("Old password does not match");
            return false;
        } catch (Exception exception) {
            logger.error("Error occurred while updating password: {}", exception.getMessage());
            return false;
        }
    }

    @Override
    public boolean deactivateAccount(UUID profileId, String password) {
        logger.debug("Inside deactivateAccount method");
        try {
            Profile profile = profileRepository.findById(profileId).orElseThrow(() -> new ServiceException("Profile not found"));
            if (passwordEncoder.matches(password, profile.getPassword())) {
                profileRepository.deleteById(profileId);
                return true;
            }
            logger.error("Password does not match");
            return false;
        } catch (Exception exception) {
            logger.error("Error occurred while deactivating account: {}", exception.getMessage());
            return false;
        }
    }

    @Override
    public boolean login(String username, String password) {
        logger.debug("Inside login method");
        try {
            Profile profile = findByUsername(username);
            // Compare the plain text password with the encoded password
            boolean isPasswordMatch = passwordEncoder.matches(password, profile.getPassword());
            if (!isPasswordMatch) {
                logger.warn("Password does not match for username: {}", username);
            }
            return isPasswordMatch;
        } catch (Exception exception) {
            logger.error("Login failed: {}", exception.getMessage());
            return false;
        }
    }
}
