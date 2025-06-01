package com.group4.eKart.controller.customer;

import com.group4.eKart.model.Profile;
import com.group4.eKart.service.ProfileServiceImpl;
import com.group4.eKart.util.JwtUtil;
import com.group4.eKart.util.SecurityUtil;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.Map;
import java.util.Objects;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/customer")
public class CustomerProfileController {
    @Autowired
    ProfileServiceImpl profileService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            boolean isAuthenticated = profileService.login(username, password);
            if (isAuthenticated) {
                // Generate JWT token with role claim
                Profile profile = profileService.findByUsername(username);
                String role = profile.getRole().name(); // Ensure this returns "CUSTOMER" or "ADMIN"
                String token = Jwts.builder()
                        .setSubject(username)
                        .claim("role", role)
                        .setIssuedAt(new Date())
                        .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // Token valid for 1 day
                        .signWith(SignatureAlgorithm.HS256, JwtUtil.getSecretKey())
                        .compact();

                // Include username, email, and account type/role in the response
                return ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "token", token,
                        "profileId", profile.getProfileId(),
                        "username", profile.getUsername(),
                        "name", profile.getName(),
                        "email", profile.getEmail(),
                        "role", role,
                        "address", profile.getAddress(),
                        "phoneNumber", profile.getPhno()
                ));
            }
            return ResponseEntity.status(401).body("Invalid username or password");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred during login: " + e.getMessage());
        }
    }

    @PatchMapping("/updateProfile")
    public Profile updateProfile(@RequestBody Profile profile) {
        String currentUsername = SecurityUtil.getCurrentUsername();
        Profile currentProfile = profileService.findByUsername(currentUsername);

        // Accept update if the request is authenticated (profileId is not required in PATCH body)
        if (currentProfile != null) {
            // Only update fields that are provided (not null)
            if (profile.getName() != null) currentProfile.setName(profile.getName());
            if (profile.getPhno() != null) currentProfile.setPhno(profile.getPhno());
            if (profile.getAddress() != null) currentProfile.setAddress(profile.getAddress());
            // Never update username or password here
            return profileService.updateProfile(currentProfile);
        } else {
            throw new ServiceException("Un-Authorized");
        }
    }

    @PatchMapping("/changePassword")
    public boolean changePassword(@RequestBody Map<String, String> passwordRequest) {
        String oldPassword = passwordRequest.get("oldPassword");
        String newPassword = passwordRequest.get("newPassword");
        return profileService.changePassword(profileService.findByUsername(SecurityUtil.getCurrentUsername()).getProfileId(), oldPassword, newPassword);
    }

    @DeleteMapping("/deactivate")
    public boolean deactivate(@RequestBody Map<String, String> deactivateRequest) {
        String password = deactivateRequest.get("password");
        return profileService.deactivateAccount(profileService.findByUsername(SecurityUtil.getCurrentUsername()).getProfileId(), password);
    }
}
