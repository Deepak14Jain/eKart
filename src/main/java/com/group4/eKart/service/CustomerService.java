package com.group4.eKart.service;

import com.group4.eKart.model.User;
import org.springframework.stereotype.Service;

@Service
public interface CustomerService {
    public User registerCustomer(User customer);
    public User getCustomerProfile(Long userId);
    public User updateCustomerProfile(Long userId, User updatedData);
}
