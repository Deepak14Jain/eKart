package com.group4.eKart.repository;

import com.group4.eKart.model.Product;
import com.group4.eKart.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findAllByProductCategory(ProductCategory productCategory);
    Product findByName(String productName);
}
