package com.group4.eKart.controller.admin;

import com.group4.eKart.model.Profile;
import com.group4.eKart.service.ProfileServiceImpl;
import com.group4.eKart.util.JwtUtil;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
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

    @PatchMapping("/updateProfile")
    public Profile updateProfile(@RequestBody Profile profile) {
        return profileService.updateProfile(profile);
    }

    @GetMapping("/findByUsername/{username}")
    public Profile findByUsername(@PathVariable String username) {
        return profileService.findByUsername(username);
    }

    @PatchMapping("/changePassword")
    public boolean changePassword(@RequestParam UUID profileId, @RequestParam String oldPassword, @RequestParam String newPassword) {
        return profileService.changePassword(profileId, oldPassword, newPassword);
    }

     @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            boolean isAuthenticated = profileService.login(username, password);
            if (isAuthenticated) {
                Profile profile = profileService.findByUsername(username);
                // Generate JWT token with role claim
                String token = Jwts.builder()
                        .setSubject(username)
                        .claim("role", profile.getRole().name())
                        .setIssuedAt(new Date())
                        .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // Token valid for 1 day
                        .signWith(SignatureAlgorithm.HS256, JwtUtil.getSecretKey())
                        .compact();

                return ResponseEntity.ok(Map.of("message", "Login successful", "token", token));
            }
            return ResponseEntity.status(401).body("Invalid username or password");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred during login: " + e.getMessage());
        }
    }
}
