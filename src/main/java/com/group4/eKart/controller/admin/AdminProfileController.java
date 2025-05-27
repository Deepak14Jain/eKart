package com.group4.eKart.controller.admin;

import com.group4.eKart.model.Profile;
import com.group4.eKart.service.ProfileServiceImpl;
import com.group4.eKart.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
public class AdminProfileController {
    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    ProfileServiceImpl profileService;

    @GetMapping("/getUserById/{profileId}")
    public Profile getUserById(@PathVariable UUID profileId) {
        return profileService.getUserById(profileId);
    }

    @GetMapping("/getAllProfiles")
    public List<Profile> getAllProfiles() {
        return profileService.getAllProfiles();
    }

    @PutMapping("/updateProfile")
    public Profile updateProfile(@RequestBody Profile profile) {
        return profileService.updateProfile(profile);
    }

    @GetMapping("/findByUsername/{username}")
    public Profile findByUsername(@PathVariable String username) {
        return profileService.findByUsername(username);
    }

    @PutMapping("/changePassword")
    public boolean changePassword(@RequestParam UUID profileId, @RequestParam String oldPassword, @RequestParam String newPassword) {
        return profileService.changePassword(profileId, oldPassword, newPassword);
    }

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        Profile profile = profileService.findByUsername(username);
        if (profile != null && "ADMIN".equalsIgnoreCase(profile.getRole().name())
                && passwordEncoder.matches(password, profile.getPassword())) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.status(401).body(false);
    }
}
