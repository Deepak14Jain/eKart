package com.group4.eKart.controller;

import com.group4.eKart.model.Product;
import com.group4.eKart.service.ProductServiceImpl;
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
//    public List<SalesSummaryDTO> getSalesSummaryByProduct(TimeRange range);
//    public List<SalesSummaryDTO> getSalesSummaryByCategory(TimeRange range);
//    public Map<String, Object> getSalesReport(String period); // e.g., WEEK, MONTH
//    public List<Product> getFastMovingProducts();
//    public List<Product> getSlowMovingProducts();
//    public List<Feedback> getAllFeedback();
}
