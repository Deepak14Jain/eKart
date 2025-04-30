package com.group4.eKart.service;

import com.group4.eKart.dto.SalesSummaryDTO;
import com.group4.eKart.model.*;
import com.group4.eKart.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class ProfileServiceImpl implements ProfileService {

    @Autowired
    ProfileRepository profileRepository;

    @Override
    public Profile registerProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    @Override
    public Profile getUserById(UUID profileId) {
        return profileRepository.findById(profileId).get();
    }

    @Override
    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    @Override
    public Profile updateProfile(Profile profile) {
        Profile updatedProfile = profileRepository.findById(profile.getProfileId()).get();
        updatedProfile.setName(profile.getName());
        updatedProfile.setPhno(profile.getPhno());
        updatedProfile.setAddress(profile.getAddress());
        profileRepository.save(updatedProfile);
        return updatedProfile;
    }

    @Override
    public boolean deleteProfile(UUID profileId) {
        if (profileRepository.existsById(profileId)) {
            profileRepository.deleteById(profileId);
            return true;
        }
        return false;
    }

    @Override
    public Profile findByUsername(String username) {
        return profileRepository.findByUsername(username);
    }

    @Override
    public boolean changePassword(UUID profileId, String oldPassword, String newPassword) {
        Profile profile = profileRepository.findById(profileId).get();
        if (Objects.equals(profile.getPassword(), oldPassword)){
            profile.setPassword(newPassword);
            return true;
        }
        return false;
    }

    @Override
    public boolean deactivateAccount(UUID profileId, String password) {
        Profile profile = profileRepository.findById(profileId).get();
        if (Objects.equals(profile.getPassword(), password)){
            profileRepository.deleteById(profileId);
            return true;
        }
        return false;
    }
}
