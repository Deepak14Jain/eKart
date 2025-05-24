package com.group4.eKart.controller;

import com.group4.eKart.model.Profile;
import com.group4.eKart.service.ProfileServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublicController {

    @Autowired
    ProfileServiceImpl profileService;

    @PostMapping("profile/register")
    public Profile registerProfile(@RequestBody Profile newProfile) {
        return profileService.registerProfile(newProfile);
    }
}
