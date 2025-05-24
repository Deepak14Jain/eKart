package com.group4.eKart.controller;

import com.group4.eKart.model.Product;
import com.group4.eKart.model.Profile;
import com.group4.eKart.service.ProductServiceImpl;
import com.group4.eKart.service.ProfileServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublicController {

    @Autowired
    ProfileServiceImpl profileService;

    @Autowired
    ProductServiceImpl productService;

    @GetMapping("/healthCheck")
    public String healthCheck() {
        return "OK";
    }

    @PostMapping("/profile/register")
    public Profile registerProfile(@RequestBody Profile newProfile) {
        return profileService.registerProfile(newProfile);
    }

    @GetMapping("/products/getAll")
    public List<Product> viewAllProducts() {
        return productService.viewAllProducts();
    }
}
