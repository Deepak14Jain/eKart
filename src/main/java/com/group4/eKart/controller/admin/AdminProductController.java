package com.group4.eKart.controller.admin;

import com.group4.eKart.model.Product;
import com.group4.eKart.service.ProductServiceImpl;
import com.group4.eKart.dto.SalesSummaryDTO;
import com.group4.eKart.model.TimeRange;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/products")
public class AdminProductController {
    @Autowired
    ProductServiceImpl productService;

    @GetMapping("/getById/{productId}")
    public Product viewById(@PathVariable UUID productId) {
        return productService.getProductById(productId);
    }

    @GetMapping("/getAll")
    public List<Product> viewAllProducts() {
        return productService.viewAllProducts();
    }

    @PostMapping("/addProduct")
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @PutMapping("/updateProduct")
    public Product updateProduct(@RequestBody Product product) {
        return productService.updateProduct(product);
    }

    @DeleteMapping("/deleteById/{productId}")
    public Boolean deleteProduct(@PathVariable UUID productId) {
        return productService.deleteProduct(productId);
    }

    @GetMapping("/getSalesSummaryByProduct/{timeRange}")
    public List<SalesSummaryDTO> getSalesSummaryByProduct(@PathVariable TimeRange timeRange) {
        return productService.getSalesSummaryByProduct(timeRange);
    }

    @GetMapping("/getSalesSummaryByCategory/{timeRange}")
    public List<SalesSummaryDTO> getSalesSummaryByCategory(@PathVariable TimeRange timeRange) {
        return productService.getSalesSummaryByCategory(timeRange);
    }

//    public Map<String, Object> getSalesReport(String period); // e.g., WEEK, MONTH
//    public List<Product> getFastMovingProducts();
//    public List<Product> getSlowMovingProducts();
//    public List<Feedback> getAllFeedback();
}
