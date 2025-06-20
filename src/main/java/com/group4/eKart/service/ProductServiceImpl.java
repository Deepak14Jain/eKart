package com.group4.eKart.service;

import com.group4.eKart.dto.SalesSummaryDTO;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.ProductCategory;
import com.group4.eKart.model.TimeRange;
import com.group4.eKart.repository.OrderItemRepository;
import com.group4.eKart.repository.ProductRepository;
import com.group4.eKart.validator.ProductValidations;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {
    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);

    private ProductValidations productValidations;

    @Autowired
    public ProductServiceImpl(ProductValidations productValidations) {
        this.productValidations = productValidations;
    }

    @Autowired
    ProductRepository productRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Override
    public List<Product> getProductsByCategory(ProductCategory category) {
        logger.debug("Inside getProductsByCategory method");
        return productRepository.findAllByProductCategory(category);
    }

    @Override
    public Product getProductById(UUID productId) {
        logger.debug("Inside getProductById method");
        return productRepository.findById(productId).get();
    }

    @Override
    public Product getPruductByName(String productName) {
        logger.debug("Inside getPruductByName method");
        return productRepository.findByName(productName);
    }

    @Override
    public List<Product> viewAllProducts() {
        logger.debug("Inside viewAllProducts method");
        return productRepository.findAll();
    }

    @Override
    public Product addProduct(Product product) {
        logger.debug("Inside addProduct method");
        try {
            productValidations.validateProduct(product);
            return productRepository.save(product);
        } catch (Exception exception) {
            logger.error("{}\nProduct could not be added", exception.getMessage());
            return null;
        }
    }

    @Override
    public Product updateProduct(Product product) {
        logger.debug("Inside updateProduct method");
        try {
            Product updatedProduct = productRepository.findById(product.getProductId()).get();
            productValidations.validateProduct(product);
            updatedProduct.setName(product.getName());
            updatedProduct.setPrice(product.getPrice());
            updatedProduct.setDescription(product.getDescription());
            updatedProduct.setProductCategory(product.getProductCategory());
            updatedProduct.setQuantityOnHand(product.getQuantityOnHand());
            // Add these lines to update image if present
            if (product.getImagePath() != null) {
                updatedProduct.setImagePath(product.getImagePath());
                updatedProduct.setImageType(product.getImageType());
            }
            productRepository.save(updatedProduct);
            logger.info("Product: {} updated successfully", product.getName());
            return updatedProduct;
        } catch (Exception exception) {
            logger.error("{}\nProduct updation failed.", exception.getMessage());
            return null;
        }
    }

    @Override
    public Boolean deleteProduct(UUID productId) {
        logger.debug("Inside deleteProduct method");
        if (productRepository.existsById(productId)) {
            productRepository.deleteById(productId);
            logger.info("Product deleted successfully.");
            return true;
        }
        logger.error("Product does not exist, deletion failed.");
        return false;
    }

    @Override
    @Transactional
    public List<SalesSummaryDTO> getSalesSummaryByProduct(TimeRange range) {
        logger.debug("Inside getSalesSummaryByProduct method");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate = getStartDateTimeFor(range, now);
        return orderItemRepository.getProductWiseSalesBetween(startDate, now);
    }

    @Override
    @Transactional
    public List<SalesSummaryDTO> getSalesSummaryByCategory(TimeRange range) {
        logger.debug("Inside getSalesSummaryByCategory method");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate = getStartDateTimeFor(range, now);
        return orderItemRepository.getCategoryWiseSalesBetween(startDate, now);
    }

    private LocalDateTime getStartDateTimeFor(TimeRange range, LocalDateTime now) {
        return switch (range) {
            case WEEK -> now.minusWeeks(1);
            case MONTH -> now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
            case QUARTER -> now.withMonth(((now.getMonthValue() - 1) / 3) * 3 + 1).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
            case YEAR -> now.withDayOfYear(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
            default -> now.minusYears(10);
        };
    }

    @Override
    public Product saveProduct(Product product) {
        return productRepository.save(product); // Save the product to the database
    }
}
