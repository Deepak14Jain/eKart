package com.group4.eKart.controller.customer;

import com.group4.eKart.model.Profile;
import com.group4.eKart.service.ProfileServiceImpl;
import com.group4.eKart.util.SecurityUtil;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/customer")
public class CustomerProfileController {
    @Autowired
    ProfileServiceImpl profileService;

    @GetMapping("/login")
    public boolean login(@RequestParam String username, @RequestParam String password) {
        return profileService.login(username, password);
    }

    @PutMapping("/updateProfile")
    public Profile updateProfile(@RequestBody Profile profile) {
        if (Objects.equals(profile.getUsername(), SecurityUtil.getCurrentUsername()))
            return profileService.updateProfile(profile);
        else
            throw new ServiceException("Un-Authorized");
    }

    @PutMapping("/changePassword")
    public boolean changePassword(@RequestParam String oldPassword, @RequestParam String newPassword) {
        return profileService.changePassword(profileService.findByUsername(SecurityUtil.getCurrentUsername()).getProfileId(), oldPassword, newPassword);
    }

    @DeleteMapping("/deactivate/{password}")
    public boolean deactivate(@PathVariable String password) {
        return profileService.deactivateAccount(profileService.findByUsername(SecurityUtil.getCurrentUsername()).getProfileId(), password);
    }

}
