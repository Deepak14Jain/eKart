package com.group4.eKart.controller.customer;

import com.group4.eKart.model.Feedback;
import com.group4.eKart.service.FeedbackServiceImpl;
import com.group4.eKart.service.ProductServiceImpl;
import com.group4.eKart.service.ProfileServiceImpl;
import com.group4.eKart.service.BillingOrderServiceImpl;
import com.group4.eKart.util.SecurityUtil;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;
import com.group4.eKart.model.Product;
import com.group4.eKart.model.BillingOrder;
import com.group4.eKart.model.OrderItem;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/customer")
public class CustomerFeedbackController {
    @Autowired
    FeedbackServiceImpl feedbackService;

    @Autowired
    ProfileServiceImpl profileService;

    @Autowired
    ProductServiceImpl productService;

    @Autowired
    BillingOrderServiceImpl billingOrderService;

    @PostMapping("/submitFeedback")
    public Feedback submitFeedback(
            @RequestParam("productId") UUID productId,
            @RequestParam("comment") String comment,
            @RequestParam(value = "rating", required = false) Integer rating // Accept rating as optional
    ) {
        return feedbackService.submitFeedback(
            profileService.findByUsername(SecurityUtil.getCurrentUsername()),
            productService.getProductById(productId),
            comment,
            rating
        );
    }

    @GetMapping("/hasFeedback")
    public boolean hasFeedback(@RequestParam("productId") UUID productId) {
        UUID profileId = profileService.findByUsername(SecurityUtil.getCurrentUsername()).getProfileId();
        return feedbackService.getFeedbackByUser(profileId)
                .stream()
                .anyMatch(fb -> fb.getProduct() != null && productId.equals(fb.getProduct().getProductId()));
    }

    @GetMapping("/productsWithoutFeedback")
    public List<UUID> getProductsWithoutFeedback() {
        String username = SecurityUtil.getCurrentUsername();
        UUID profileId = profileService.findByUsername(username).getProfileId();

        // Use billingOrderService to get orders by username
        List<com.group4.eKart.model.BillingOrder> orders = billingOrderService.getBillingOrdersByProfileUsername(username);

        Set<UUID> orderedProductIds = new HashSet<>();
        for (com.group4.eKart.model.BillingOrder order : orders) {
            for (OrderItem item : order.getItems()) {
                orderedProductIds.add(item.getProduct().getProductId());
            }
        }

        List<Feedback> userFeedbacks = feedbackService.getFeedbackByUser(profileId);

        Set<UUID> feedbackProductIds = userFeedbacks.stream()
                .filter(fb -> fb.getProduct() != null)
                .map(fb -> fb.getProduct().getProductId())
                .collect(Collectors.toSet());

        return orderedProductIds.stream()
                .filter(pid -> !feedbackProductIds.contains(pid))
                .collect(Collectors.toList());
    }

}
