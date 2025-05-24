package com.group4.eKart.service;

import com.group4.eKart.model.Feedback;
import com.group4.eKart.model.Profile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface ProfileService {
    public Profile registerProfile(Profile profile);
    public Profile getUserById(UUID profileId);
    public List<Profile> getAllProfiles();
    public Profile updateProfile(Profile profile);
    public boolean deleteProfile(UUID profileId);
    public Profile findByUsername(String username);
    public boolean changePassword(UUID profileId, String oldPassword, String newPassword);
    public boolean deactivateAccount(UUID profileId, String password);
    public boolean login(String username, String password);
}
