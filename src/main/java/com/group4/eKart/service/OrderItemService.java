package com.group4.eKart.service;

import com.group4.eKart.model.BillingOrder;
import com.group4.eKart.model.OrderItem;
import com.group4.eKart.model.Product;
import org.springframework.stereotype.Service;

@Service
public interface OrderItemService {
    OrderItem createNewOrderItem(BillingOrder billingOrder, Product product, int quantity);
}
