package com.group4.eKart.controller.customer;

import com.group4.eKart.model.Feedback;
import com.group4.eKart.service.FeedbackServiceImpl;
import com.group4.eKart.service.ProductServiceImpl;
import com.group4.eKart.service.ProfileServiceImpl;
import com.group4.eKart.util.SecurityUtil;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

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

    @PostMapping("/submitFeedback")
    public Feedback submitFeedback(@RequestParam("productId") UUID productId, @RequestParam("comment") String comment) {
        return feedbackService.submitFeedback(profileService.findByUsername(SecurityUtil.getCurrentUsername()), productService.getProductById(productId), comment);
    }


}
