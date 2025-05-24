package com.group4.eKart.service;

import com.group4.eKart.model.Profile;
import com.group4.eKart.repository.ProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(ProfileServiceImpl.class);

    @Autowired
    ProfileRepository profileRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try{
            Profile profile = profileRepository.findByUsername(username);
            return User.withUsername(profile.getUsername())
                    .password(profile.getPassword())
                    .roles(profile.getRole().name())
                    .build();
        } catch (Exception exception) {
            logger.error(exception.toString());
            throw new UsernameNotFoundException(exception.getMessage());
        }
    }
}
