package com.group4.eKart.service;

import com.group4.eKart.dto.SalesSummaryDTO;
import com.group4.eKart.model.Feedback;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.ProductCategory;
import com.group4.eKart.model.TimeRange;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public interface ProductService {
    public List<Product> getProductsByCategory(ProductCategory category);
    public Product getProductById(UUID productId);
    public Product getPruductByName(String productName);
    public List<Product> viewAllProducts();
    public Product addProduct(Product product);
    public Product updateProduct(Product product);
    public Boolean deleteProduct(UUID productId);
    public List<SalesSummaryDTO> getSalesSummaryByProduct(TimeRange range);
    public List<SalesSummaryDTO> getSalesSummaryByCategory(TimeRange range);
    public Product saveProduct(Product product); // Add saveProduct method
//    public Map<String, Object> getSalesReport(String period); // e.g., WEEK, MONTH
//    public List<Product> getFastMovingProducts();
//    public List<Product> getSlowMovingProducts();
}
