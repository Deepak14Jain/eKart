package com.group4.eKart.service;

import com.group4.eKart.dto.OrderResponseDTO;
import com.group4.eKart.model.*;
import com.group4.eKart.repository.BillingOrderRepository;
import com.group4.eKart.repository.CartItemRepository;
import com.group4.eKart.validator.BillingOrderValidations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BillingOrderServiceImpl implements BillingOrderService {

    @Autowired
    private BillingOrderRepository billingOrderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderItemServiceImpl orderItemService;

    @Autowired
    private BillingOrderValidations billingOrderValidations;

    @Autowired
    private ProductService productService; // Add ProductService for saving products

    @Override
    @Transactional
    public BillingOrder placeInstantOrder(Profile profile, Product product, int quantity) {
        // Validate inputs
        billingOrderValidations.validateProfile(profile);
        billingOrderValidations.validateProductStock(product, quantity);

        // Proceed with order placement
        BillingOrder billingOrder = new BillingOrder();
        billingOrder.setProfile(profile);
        billingOrder.setOrderDate(LocalDateTime.now());

        // Reduce stock
        product.setQuantityOnHand(product.getQuantityOnHand() - quantity);

        // Create and attach order item
        OrderItem orderItem = orderItemService.createNewOrderItem(billingOrder, product, quantity);
        billingOrder.getItems().add(orderItem);

        // Save order
        billingOrderRepository.save(billingOrder);
        return billingOrder;
    }

    @Override
    @Transactional
    public BillingOrder placeOrder(Profile profile) {
        // Validate profile
        billingOrderValidations.validateProfile(profile);

        List<CartItem> cartItems = cartItemRepository.findByProfileUsername(profile.getUsername());

        // Validate cart contents
        billingOrderValidations.validateCartItems(cartItems);

        BillingOrder billingOrder = new BillingOrder();
        billingOrder.setProfile(profile);
        billingOrder.setOrderDate(LocalDateTime.now());

        // Save the BillingOrder first
        billingOrderRepository.save(billingOrder);

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            // Stock validation per item
            billingOrderValidations.validateProductStock(product, cartItem.getQuantity());

            // Reduce product stock
            product.setQuantityOnHand(product.getQuantityOnHand() - cartItem.getQuantity());
            productService.saveProduct(product); // Save the updated product to persist changes

            // Create and attach order item
            OrderItem orderItem = orderItemService.createNewOrderItem(billingOrder, product, cartItem.getQuantity());
            billingOrder.getItems().add(orderItem);
        }

        // Save the final billing order with all items
        billingOrderRepository.save(billingOrder);

        // Clear the cart
        cartItemRepository.deleteByProfileUsername(profile.getUsername());

        return billingOrder;
    }

    @Override
    public BillingOrder getOrderById(UUID billingOrderId) {
        Optional<BillingOrder> optionalOrder = billingOrderRepository.findById(billingOrderId);
        BillingOrder order = optionalOrder.orElseThrow(() ->
                new IllegalArgumentException("Order not found with ID: " + billingOrderId));

        // Optional: validate existence
        billingOrderValidations.validateOrderExists(order, billingOrderId.toString());
        return order;
    }

    private OrderResponseDTO mapToOrderResponseDTO(BillingOrder order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.orderId = order.getBillingOrderId();
        dto.orderDate = order.getOrderDate();
        dto.status = order.getBillingOrderStatus().name();
        dto.items = order.getItems().stream().map(item -> {
            OrderResponseDTO.ItemDTO itemDTO = new OrderResponseDTO.ItemDTO();
            itemDTO.productId = item.getProduct().getProductId();
            itemDTO.productName = item.getProduct().getName();
            itemDTO.quantity = item.getQuantity();
            itemDTO.price = item.getPriceAtOrderTime();
            return itemDTO;
        }).toList();
        dto.totalAmount = dto.items.stream().mapToDouble(i -> i.price * i.quantity).sum();
        return dto;
    }

    @Override
    public List<OrderResponseDTO> getOrdersByProfile(String username) {
        List<BillingOrder> orders = billingOrderRepository.findByProfileUsername(username);
        return orders.stream().map(this::mapToOrderResponseDTO).toList();
    }

    @Override
    public List<OrderResponseDTO> getAllOrders() {
        List<BillingOrder> orders = billingOrderRepository.findAll();
        return orders.stream().map(this::mapToOrderResponseDTO).toList();
    }

    @Override
    public boolean cancelOrder(String username, UUID billingOrderId) {
        Optional<BillingOrder> optionalOrder = billingOrderRepository.findById(billingOrderId);
        BillingOrder billingOrder = optionalOrder.orElseThrow(() ->
                new IllegalArgumentException("Order not found with ID: " + billingOrderId));

        billingOrder.setBillingOrderStatus(BillingOrderStatus.CANCELLED);
        billingOrderRepository.save(billingOrder);
        return true;
    }
}
