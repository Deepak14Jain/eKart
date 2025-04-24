package com.group4.eKart.service;

import com.group4.eKart.model.Product;
import com.group4.eKart.model.ProductCategory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface ProductService {
    public List<Product> getAllProducts();
    public List<Product> getProductsByCategory(ProductCategory category);
    public Product getProductById(UUID productId);
    public List<Product> searchProducts(String keyword);
}
