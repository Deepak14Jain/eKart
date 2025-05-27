package com.group4.eKart.controller;

import com.group4.eKart.model.Feedback;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.ProductCategory;
import com.group4.eKart.model.Profile;
import com.group4.eKart.service.FeedbackServiceImpl;
import com.group4.eKart.service.ProductServiceImpl;
import com.group4.eKart.service.ProfileServiceImpl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class PublicController {
    @GetMapping("/healthCheck")
    public String healthCheck() {
        return "OK";
    }


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
    public Profile registerProfile(@RequestBody Profile newProfile) {
        return profileService.registerProfile(newProfile);
    }

    @PostMapping("/profile/login")
    public boolean loginProfile(@RequestParam("username") String username, @RequestParam("password") String password) {
        return profileService.login(username, password);
    }


    @Autowired
    FeedbackServiceImpl feedbackService;

    @GetMapping("/getFeedbackByProduct/{productId}")
    public List<Feedback> viewProductFeedbacks(@PathVariable UUID productId) {
        return feedbackService.getFeedbackByProduct(productId);
    }
}
