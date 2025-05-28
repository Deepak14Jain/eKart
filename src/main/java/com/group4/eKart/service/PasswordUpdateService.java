package com.group4.eKart.service;

import com.group4.eKart.model.Profile;
import com.group4.eKart.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PasswordUpdateService {

    @Autowired
    private ProfileRepository profileRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void encodePasswords() {
        List<Profile> profiles = profileRepository.findAll();
        for (Profile profile : profiles) {
            if (!passwordEncoder.matches(profile.getPassword(), profile.getPassword())) {
                profile.setPassword(passwordEncoder.encode(profile.getPassword()));
                profileRepository.save(profile);
            }
        }
    }
}
