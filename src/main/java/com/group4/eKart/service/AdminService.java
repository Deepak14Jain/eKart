package com.group4.eKart.service;

import com.group4.eKart.model.Feedback;
import com.group4.eKart.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public interface AdminService {
    public List<Product> viewAllProducts();
    public Product addProduct(Product product);
    public Product updateProduct(UUID productId, Product product);
    public Boolean deleteProduct(UUID productId);

    public Map<String, Object> getSalesReport(String period); // e.g., WEEK, MONTH
    public List<Product> getFastMovingProducts();
    public List<Product> getSlowMovingProducts();
    public List<Feedback> getAllFeedback();
}
