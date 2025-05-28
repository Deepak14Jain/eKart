package com.group4.eKart.controller;

import com.group4.eKart.model.Feedback;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.ProductCategory;
import com.group4.eKart.model.Profile;
import com.group4.eKart.model.Roles;
import com.group4.eKart.service.FeedbackServiceImpl;
import com.group4.eKart.service.ProductServiceImpl;
import com.group4.eKart.service.ProfileServiceImpl;
import com.group4.eKart.util.JwtUtil;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class PublicController {
    @Autowired
    ProductServiceImpl productService;


    @GetMapping("/products/getAll")
    public List<Product> viewAllProducts() {
        return productService.viewAllProducts();
    }

    @GetMapping("/products/getAllByCategory/{productCategory}")
    public List<Product> viewAllByCategory(@PathVariable ProductCategory productCategory) {
        return productService.getProductsByCategory(productCategory);
    }

    @GetMapping("/products/getByName/{productName}")
    public Product getProductByName(@PathVariable String productName) {
        return productService.getPruductByName(productName);
    }


    @Autowired
    ProfileServiceImpl profileService;
    
    @PostMapping("/profile/register")
    public ResponseEntity<?> registerProfile(@RequestBody Map<String, String> registrationRequest) {
        try {
            // Log the incoming payload
            System.out.println("Received registration payload: " + registrationRequest);

            String name = registrationRequest.get("name");
            String email = registrationRequest.get("email");
            String password = registrationRequest.get("password");
            String role = registrationRequest.get("role");

            if (name == null || email == null || password == null || role == null) {
                return ResponseEntity.status(400).body("Missing required fields");
            }

            Profile newProfile = new Profile();
            newProfile.setUsername(registrationRequest.get("username")); // Set the username
            newProfile.setName(name);
            newProfile.setEmail(email);
            newProfile.setPassword(password);
            newProfile.setRole(Roles.valueOf(role.toUpperCase()));
            newProfile.setPhno(registrationRequest.getOrDefault("phoneNumber", "")); // Handle optional phone number
            newProfile.setAddress(registrationRequest.getOrDefault("address", "Unknown")); // Handle optional address

            Profile registeredProfile = profileService.registerProfile(newProfile);
            return ResponseEntity.ok(registeredProfile);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred during registration: " + e.getMessage());
        }
    }

    @Autowired
    FeedbackServiceImpl feedbackService;

    @GetMapping("/getFeedbackByProduct/{productId}")
    public List<Feedback> viewProductFeedbacks(@PathVariable UUID productId) {
        return feedbackService.getFeedbackByProduct(productId);
    }
}
