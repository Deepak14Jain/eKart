package com.group4.eKart.controller.customer;

import com.group4.eKart.dto.OrderResponseDTO;
import com.group4.eKart.model.BillingOrder;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.Profile;
import com.group4.eKart.service.BillingOrderServiceImpl;
import com.group4.eKart.service.ProductServiceImpl;
import com.group4.eKart.service.ProfileServiceImpl;
import com.group4.eKart.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/customer")
public class CustomerBillingOrderController {
    @Autowired
    BillingOrderServiceImpl billingOrderService;

    @Autowired
    ProductServiceImpl productService;

    @Autowired
    ProfileServiceImpl profileService;

    @PostMapping("/instantOrder")
    public BillingOrder placeInstantOrder(@RequestParam("productId") UUID productId, @RequestParam("quantity") int quantity) {
        Product product = productService.getProductById(productId);
        Profile profile = profileService.findByUsername(SecurityUtil.getCurrentUsername());
        return billingOrderService.placeInstantOrder(profile, product, quantity);
    }

    @GetMapping("/cartOrder")
    public BillingOrder cartOrder() {
        Profile profile = profileService.findByUsername(SecurityUtil.getCurrentUsername());
        return billingOrderService.placeOrder(profile);
    }

    @PostMapping("/getByOrderId/{billingOrderId}")
    public BillingOrder getBillingOrderById(@PathVariable UUID billingOrderId) {
        return billingOrderService.getOrderById(billingOrderId);
    }

    @GetMapping("/getAllOrders")
    public List<OrderResponseDTO> viewMyOrders() {
        return billingOrderService.getOrdersByProfile(SecurityUtil.getCurrentUsername());
    }

    @PostMapping("/cancelOrder/{billingOrderId}")
    public Boolean cancelOder(@PathVariable UUID billingOrderId) {
        return billingOrderService.cancelOrder(SecurityUtil.getCurrentUsername(), billingOrderId);
    }
}
