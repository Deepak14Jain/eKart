package com.group4.eKart.validator;

import com.group4.eKart.model.CartItem;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.Profile;
import com.group4.eKart.repository.ProfileRepository;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CartItemValidations {
    @Autowired
    ProfileRepository profileRepository;

    public void validateQuantity(int quantity) {
        if (quantity <= 0) {
            throw new ServiceException("Cart item quantity must be greater than zero.");
        }
    }

    public void validateProduct(Product product) {
        if (product == null) {
            throw new ServiceException("Product must not be null.");
        }
    }

    public void validateProfile(Profile profile) {
        if (profile == null) {
            throw new ServiceException("Profile must not be null.");
        } else if (!profileRepository.existsById(profile.getProfileId())) {
            throw new ServiceException("Profile does not exists.");
        }
    }

    public void validateCartItem(Profile profile, Product product, int quantity) {
        validateProfile(profile);
        validateProduct(product);
        validateQuantity(quantity);
    }
}
