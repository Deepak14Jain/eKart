package com.group4.eKart.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class OrderResponseDTO {
    public UUID orderId;
    public LocalDateTime orderDate;
    public String status;
    public double totalAmount;
    public List<ItemDTO> items;

    public static class ItemDTO {
        public UUID productId;
        public String productName;
        public int quantity;
        public double price;
        public String imagePath; // New field for image path
    }
}
