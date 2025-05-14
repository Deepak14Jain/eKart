package com.group4.eKart.validator;

import com.group4.eKart.model.Product;
import org.hibernate.service.spi.ServiceException;
import org.springframework.stereotype.Component;

@Component
public class ProductValidations {
    public void validateName(String name) {
        if (name.length() > 100) {
            throw new ServiceException("Product name cannot exceed 100 characters.");
        }
    }

    public void validateDescription(String description) {
        if (description != null && description.length() > 500) {
            throw new ServiceException("Product description cannot exceed 500 characters.");
        }
    }

    public void validatePrice(double price) {
        if (price < 0) {
            throw new ServiceException("Product price cannot be negative.");
        }
    }

    public void validateQuantity(Integer quantity) {
        if (quantity == null) {
            throw new ServiceException("Product quantity cannot be null.");
        }
        if (quantity < 0) {
            throw new ServiceException("Product quantity cannot be negative.");
        }
    }

    public void validateProduct(Product product) {
        validateName(product.getName());
        validateDescription(product.getDescription());
        validatePrice(product.getPrice());
        validateQuantity(product.getQuantityOnHand());
    }
}
