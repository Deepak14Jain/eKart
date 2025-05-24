package com.group4.eKart.controller;

import com.group4.eKart.model.Product;
import com.group4.eKart.model.Profile;
import com.group4.eKart.service.ProductServiceImpl;
import com.group4.eKart.service.ProfileServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    ProductServiceImpl productService;

    @Autowired
    ProfileServiceImpl profileService;

    @GetMapping("/products/getAll")
    public List<Product> viewAllProducts() {
        return productService.viewAllProducts();
    }

    @GetMapping("/products/getByName/{productName}")
    public Product getProductByName(@PathVariable String productName) {
        return productService.getPruductByName(productName);
    }

    @PostMapping("profile/register")
    public Profile registerProfile(@RequestBody Profile newProfile) {
        return profileService.registerProfile(newProfile);
    }

    @GetMapping("profile/login")
    public boolean login(@RequestParam String username, @RequestParam String password) {
        return profileService.login(username, password);
    }

}
