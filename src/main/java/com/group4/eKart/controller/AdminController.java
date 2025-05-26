package com.group4.eKart.controller;

import com.group4.eKart.model.Product;
import com.group4.eKart.service.ProductServiceImpl;
import com.group4.eKart.dto.SalesSummaryDTO;
import com.group4.eKart.model.TimeRange;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    ProductServiceImpl productService;

    @GetMapping("/products/getAll")
    public List<Product> viewAllProducts() {
        return productService.viewAllProducts();
    }

    @PostMapping("/products/addProduct")
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @PutMapping("/products/updateProduct")
    public Product updateProduct(@RequestBody Product product) {
        return productService.updateProduct(product);
    }

    @DeleteMapping("/products/deleteById/{productId}")
    public Boolean deleteProduct(@PathVariable UUID productId) {
        return productService.deleteProduct(productId);
    }

    @GetMapping("/products/getSalesSummaryByProduct/{timeRange}")
    public List<SalesSummaryDTO> getSalesSummaryByProduct(@PathVariable TimeRange timeRange) {
        return productService.getSalesSummaryByProduct(timeRange);
    }

    @GetMapping("/products/getSalesSummaryByCategory/{timeRange}")
    public List<SalesSummaryDTO> getSalesSummaryByCategory(@RequestParam TimeRange timeRange) {
        return productService.getSalesSummaryByCategory(timeRange);
    }

//    public Map<String, Object> getSalesReport(String period); // e.g., WEEK, MONTH
//    public List<Product> getFastMovingProducts();
//    public List<Product> getSlowMovingProducts();
//    public List<Feedback> getAllFeedback();
}
