package com.group4.eKart.controller.customer;

import com.group4.eKart.model.CartItem;
import com.group4.eKart.model.Profile;
import com.group4.eKart.model.Product;
import com.group4.eKart.service.CartItemServiceImpl;
import com.group4.eKart.service.ProductServiceImpl;
import com.group4.eKart.service.ProfileServiceImpl;
import com.group4.eKart.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/customer")
public class CustomerCartItemController {
    @Autowired
    CartItemServiceImpl cartItemService;

    @Autowired
    ProductServiceImpl productService;

    @Autowired
    ProfileServiceImpl profileService;

    @PostMapping("/addToCart")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> requestBody) {
        try {
            // Extract parameters from request body
            UUID productId = UUID.fromString((String) requestBody.get("productId"));
            Integer quantity = (Integer) requestBody.get("quantity");

            // Debugging logs
            System.out.println("Received productId: " + productId);
            System.out.println("Received quantity: " + quantity);

            // Validate parameters
            if (productId == null) {
                return ResponseEntity.status(400).body("Missing required parameter: productId");
            }
            if (quantity == null || quantity <= 0) {
                return ResponseEntity.status(400).body("Invalid or missing parameter: quantity");
            }

            Profile profile = profileService.findByUsername(SecurityUtil.getCurrentUsername());
            Product product = productService.getProductById(productId);
            CartItem cartItem = cartItemService.addToCart(profile, product, quantity);
            return ResponseEntity.ok(cartItem);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while adding to cart: " + e.getMessage());
        }
    }

    @PatchMapping("/updateCartItem")
    public ResponseEntity<?> updateCartItem(@RequestBody Map<String, Object> requestBody) {
        try {
            UUID cartItemId = UUID.fromString((String) requestBody.get("cartItemId"));
            Integer quantity = (Integer) requestBody.get("quantity");

            // Validate parameters
            if (cartItemId == null) {
                return ResponseEntity.status(400).body("Missing required parameter: cartItemId");
            }
            if (quantity == null || quantity <= 0) {
                return ResponseEntity.status(400).body("Invalid or missing parameter: quantity");
            }

            CartItem updatedCartItem = cartItemService.updateCartItem(cartItemId, quantity);
            return ResponseEntity.ok(updatedCartItem);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while updating cart item: " + e.getMessage());
        }
    }

    @DeleteMapping("/removeFromCart/{cartItemId}")
    public boolean removeFromCart(@PathVariable UUID cartItemId) {
        return cartItemService.removeFromCart(profileService.findByUsername(SecurityUtil.getCurrentUsername()), cartItemId);
    }

    @GetMapping("/getCartByProfile")
    public List<CartItem> getCartByProfile() {
        return cartItemService.getCartItemsByUser(SecurityUtil.getCurrentUsername());
    }

    @DeleteMapping("/clearCart")
    public boolean clearCart() {
        return cartItemService.clearCart(SecurityUtil.getCurrentUsername());
    }
}
