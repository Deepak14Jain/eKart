package com.group4.eKart.validator;

import com.group4.eKart.model.BillingOrder;
import com.group4.eKart.model.CartItem;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.Profile;
import org.hibernate.service.spi.ServiceException;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BillingOrderValidations {

    public void validateProfile(Profile profile) {
        if (profile == null || profile.getUsername() == null || profile.getUsername().trim().isEmpty()) {
            throw new ServiceException("Invalid profile. Username is required.");
        }
    }

    public void validateProductStock(Product product, int requestedQuantity) {
        if (product == null) {
            throw new ServiceException("Product cannot be null.");
        }
        if (requestedQuantity <= 0) {
            throw new ServiceException("Requested quantity must be greater than 0.");
        }
        if (product.getQuantityOnHand() < requestedQuantity) {
            throw new ServiceException("Insufficient stock for product: " + product.getName() +
                    ". Available: " + product.getQuantityOnHand());
        }
    }

    public void validateCartItems(List<CartItem> cartItems) {
        if (cartItems == null || cartItems.isEmpty()) {
            throw new ServiceException("Cart is empty. Cannot place order.");
        }
        for (CartItem item : cartItems) {
            if (item.getProduct().getQuantityOnHand() < item.getQuantity()) {
                throw new ServiceException("Insufficient stock for product: " + item.getProduct().getName() +
                        ". Available: " + item.getProduct().getQuantityOnHand());
            }
        }
    }

    public void validateOrderExists(BillingOrder order, String context) {
        if (order == null) {
            throw new ServiceException("Billing order not found: " + context);
        }
    }
}
