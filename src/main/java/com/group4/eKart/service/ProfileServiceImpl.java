package com.group4.eKart.service;

import com.group4.eKart.model.*;
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

    private ProfileValidations profileValidations;

    @Autowired
    public ProfileServiceImpl(ProfileValidations profileValidations) {
        this.profileValidations = profileValidations;
    }

    @Autowired
    ProfileRepository profileRepository;

    @Override
    public Profile registerProfile(Profile profile) throws ServiceException{
        logger.debug("Inside registerProfile method");
        try{
            logger.info("Validating profile...");
            profileValidations.validateProfile(profile);
            profile.setPassword(passwordEncoder.encode(profile.getPassword()));
            return profileRepository.save(profile);
        } catch (Exception exception) {
            logger.error("{}\nProfile creation failed!", exception.getMessage());
            return null;
        }
    }

    @Override
    public Profile getUserById(UUID profileId) {
        logger.debug("Inside getUserById method");
        return profileRepository.findById(profileId).get();
    }

    @Override
    public List<Profile> getAllProfiles() {
        logger.debug("Inside getAllProfiles method");
        return profileRepository.findAll();
    }

    @Override
    public Profile updateProfile(Profile profile) {
        logger.debug("Inside updateProfile method");
        try{
            Profile updatedProfile = profileRepository.findById(profile.getProfileId()).get();
            updatedProfile.setName(profile.getName());
            profileValidations.validatePhone(profile.getPhno());
            updatedProfile.setPhno(profile.getPhno());
            updatedProfile.setAddress(profile.getAddress());
            profileRepository.save(updatedProfile);
            return updatedProfile;
        } catch (Exception exception) {
            logger.error("{}\nFailed to update profile!", exception.getMessage());
            return null;
        }
    }

    @Override
    public Profile findByUsername(String username) {
        logger.debug("Inside findByUsername method");
        try{
            return profileRepository.findByUsername(username);
        } catch (Exception exception) {
            logger.error("User not found!");
            throw new ServiceException("Username not found: " + username);
        }
    }

    @Override
    public boolean changePassword(UUID profileId, String oldPassword, String newPassword) {
        logger.debug("Inside changePassword method");
        try{
            Profile profile = profileRepository.findById(profileId).get();
            if (Objects.equals(profile.getPassword(), oldPassword)){
                profileValidations.validatePassword(profile.getPassword());
                profile.setPassword(newPassword);
                profileRepository.save(profile);
                return true;
            }
            logger.error("Your old password does nto match");
            return false;
        } catch (Exception exception) {
            logger.info("Error occurred while updating password:{}", exception.getMessage());
            return false;
        }
    }

    @Override
    public boolean deactivateAccount(UUID profileId, String password) {
        logger.debug("Inside deactivateAccount method");
        Profile profile = profileRepository.findById(profileId).get();
        if (Objects.equals(profile.getPassword(), passwordEncoder.encode(password))){
            profileRepository.deleteById(profileId);
            return true;
        }
        logger.error("Error deleting the account");
        return false;
    }

    @Override
    public boolean login(String username, String password) {
        logger.debug("Inside login method");
        Profile profile = findByUsername(username);
        if (profile != null){
            if (Objects.equals(profile.getPassword(), password))
                return true;
            return false;
        }
        return false;
    }
}
