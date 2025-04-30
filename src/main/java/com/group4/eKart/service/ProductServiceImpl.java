package com.group4.eKart.service;

import com.group4.eKart.dto.SalesSummaryDTO;
import com.group4.eKart.model.Feedback;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.ProductCategory;
import com.group4.eKart.model.TimeRange;
import com.group4.eKart.repository.OrderItemRepository;
import com.group4.eKart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Override
    public List<Product> getProductsByCategory(ProductCategory category) {
        return productRepository.findAllByProductCategory(category);
    }

    @Override
    public Product getProductById(UUID productId) {
        return productRepository.findById(productId).get();
    }

    @Override
    public List<Product> viewAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Product product) {
        Product updatedProduct = productRepository.findById(product.getProductId()).get();
        updatedProduct.setName(product.getName());
        updatedProduct.setPrice(product.getPrice());
        updatedProduct.setDescription(product.getDescription());
        updatedProduct.setProductCategory(product.getProductCategory());
        updatedProduct.setQuantityOnHand(product.getQuantityOnHand());
        productRepository.save(updatedProduct);
        return updatedProduct;
    }

    @Override
    public Boolean deleteProduct(UUID productId) {
        if (productRepository.existsById(productId)) {
            productRepository.deleteById(productId);
            return true;
        }
        return false;
    }

    @Override
    public List<SalesSummaryDTO> getSalesSummaryByProduct(TimeRange range) {
        LocalDate now = LocalDate.now();
        LocalDate startDate = getStartDateFor(range, now);
        return orderItemRepository.getProductWiseSalesBetween(startDate, now);
    }

    @Override
    public List<SalesSummaryDTO> getSalesSummaryByCategory(TimeRange range) {
        LocalDate now = LocalDate.now();
        LocalDate startDate = getStartDateFor(range, now);
        return orderItemRepository.getCategoryWiseSalesBetween(startDate, now);
    }

//    @Override
//    public Map<String, Object> getSalesReport(String period) {
//        return Map.of();
//    }

//    @Override
//    public List<Product> getFastMovingProducts() {
//        return List.of();
//    }
//
//    @Override
//    public List<Product> getSlowMovingProducts() {
//        return List.of();
//    }


    private LocalDate getStartDateFor(TimeRange range, LocalDate now) {
        return switch (range) {
            case WEEK -> now.minusWeeks(1);
            case MONTH -> now.withDayOfMonth(1);
            case QUARTER -> now.withMonth(((now.getMonthValue() - 1) / 3) * 3 + 1).withDayOfMonth(1);
            case YEAR -> now.withDayOfYear(1);
            default -> now.minusYears(10); // fallback
        };
    }
}
