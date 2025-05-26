package com.group4.eKart.controller.customer;

import com.group4.eKart.model.CartItem;
import com.group4.eKart.service.CartItemServiceImpl;
import com.group4.eKart.service.ProductServiceImpl;
import com.group4.eKart.service.ProfileServiceImpl;
import com.group4.eKart.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/customer")
public class CustomerCartItemController {
    @Autowired
    CartItemServiceImpl cartItemService;

    @Autowired
    ProductServiceImpl productService;

    @Autowired
    ProfileServiceImpl profileService;

    @PostMapping("/addToCart")
    public CartItem addToCart(@RequestParam("productId") UUID productId,@RequestParam("quantity") int quantity) {
        return cartItemService.addToCart(profileService.findByUsername(SecurityUtil.getCurrentUsername()), productService.getProductById(productId), quantity);

    }

    @PutMapping("/updateCartItem")
    public CartItem updateCartItem(@RequestParam("cartItemId") UUID cartItemId, @RequestParam("quantity") int quantity) {
        return cartItemService.updateCartItem(cartItemId, quantity);
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
