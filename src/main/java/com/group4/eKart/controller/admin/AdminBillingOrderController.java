package com.group4.eKart.controller.admin;

import com.group4.eKart.dto.OrderResponseDTO;
import com.group4.eKart.model.BillingOrder;
import com.group4.eKart.service.BillingOrderServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/admin")
public class AdminBillingOrderController {
    @Autowired
    BillingOrderServiceImpl billingOrderService;

    @PostMapping("/getByOrderId/{billingOrderId}")
    public BillingOrder getBillingOrderById(@PathVariable UUID billingOrderId) {
        return billingOrderService.getOrderById(billingOrderId);
    }

    @GetMapping("/getOrdersByProfile/{username}")
    public List<OrderResponseDTO> viewOrdersByProfile(@PathVariable String username) {
        return billingOrderService.getOrdersByProfile(username);
    }

    @PostMapping("/cancelCustomerOrder")
    public Boolean cancelOder(@RequestParam String username, @RequestParam UUID billingOrderId) {
        return billingOrderService.cancelOrder(username, billingOrderId);
    }

    @GetMapping("/getAllOrders")
    public List<OrderResponseDTO> viewAllOrders() {
        return billingOrderService.getAllOrders();
    }
}
