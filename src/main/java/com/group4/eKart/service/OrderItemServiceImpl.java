package com.group4.eKart.service;

import com.group4.eKart.model.BillingOrder;
import com.group4.eKart.model.OrderItem;
import com.group4.eKart.model.Product;
import com.group4.eKart.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderItemServiceImpl implements OrderItemService {
    @Autowired
    OrderItemRepository orderItemRepository;

    @Override
    public OrderItem createNewOrderItem(BillingOrder billingOrder, Product product, int quantity) {
        OrderItem orderItem = new OrderItem();

        orderItem.setProduct(product);
        orderItem.setBillingOrder(billingOrder);
        orderItem.setQuantity(quantity);
        orderItem.setPriceAtOrderTime(product.getPrice());
        orderItemRepository.save(orderItem);
        return orderItem;
    }
}
