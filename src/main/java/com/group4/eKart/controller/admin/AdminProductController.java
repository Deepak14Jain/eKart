package com.group4.eKart.controller.admin;

import com.group4.eKart.model.Product;
import com.group4.eKart.service.ProductServiceImpl;
import com.group4.eKart.dto.SalesSummaryDTO;
import com.group4.eKart.model.TimeRange;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.HttpMediaTypeNotSupportedException;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/admin/products")
public class AdminProductController {
    @Autowired
    ProductServiceImpl productService;

    @GetMapping("/getById/{productId}")
    public Product viewById(@PathVariable UUID productId) {
        return productService.getProductById(productId);
    }

    @GetMapping("/getAll")
    public List<Product> viewAllProducts() {
        return productService.viewAllProducts();
    }

    @PostMapping(
        value = "/addProduct",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Product addProduct(@RequestPart("product") Product product,
                             @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        product.setProductId(null);

        if (image != null && !image.isEmpty()) {
            String contentType = image.getContentType();
            if (contentType == null ||
                (!contentType.startsWith("image/") && !contentType.equals("application/octet-stream"))) {
                throw new HttpMediaTypeNotSupportedException("Unsupported Content-Type: " + contentType);
            }
            // Save image to disk
            String uploadDir = System.getProperty("user.dir") + "/product-images";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.write(filePath, image.getBytes());
            product.setImagePath(filePath.toString());
            product.setImageType(contentType);
        } else {
            product.setImagePath(null);
            product.setImageType(null);
        }

        return productService.addProduct(product);
    }

    @PatchMapping(
        value = "/updateProduct",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Product updateProduct(@RequestPart("product") Product product,
                                @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        if (image != null && !image.isEmpty()) {
            String contentType = image.getContentType();
            if (contentType == null ||
                (!contentType.startsWith("image/") && !contentType.equals("application/octet-stream"))) {
                throw new HttpMediaTypeNotSupportedException("Unsupported Content-Type: " + contentType);
            }
            String uploadDir = System.getProperty("user.dir") + "/product-images";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.write(filePath, image.getBytes());
            product.setImagePath(filePath.toString());
            product.setImageType(contentType);
        }
        return productService.updateProduct(product);
    }

    @DeleteMapping("/deleteById/{productId}")
    public Boolean deleteProduct(@PathVariable UUID productId) {
        return productService.deleteProduct(productId);
    }

    @GetMapping("/getSalesSummaryByProduct/{timeRange}")
    public List<SalesSummaryDTO> getSalesSummaryByProduct(@PathVariable TimeRange timeRange) {
        return productService.getSalesSummaryByProduct(timeRange);
    }

    @GetMapping("/getSalesSummaryByCategory/{timeRange}")
    public List<SalesSummaryDTO> getSalesSummaryByCategory(@PathVariable TimeRange timeRange) {
        return productService.getSalesSummaryByCategory(timeRange);
    }

    @GetMapping("/getImage/{productId}")
    public ResponseEntity<byte[]> getProductImage(@PathVariable UUID productId) throws Exception {
        Product product = productService.getProductById(productId);
        if (product.getImagePath() != null) {
            Path imagePath = Paths.get(product.getImagePath());
            byte[] imageBytes = Files.readAllBytes(imagePath);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(product.getImageType()))
                    .body(imageBytes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

//    public Map<String, Object> getSalesReport(String period); // e.g., WEEK, MONTH
//    public List<Product> getFastMovingProducts();
//    public List<Product> getSlowMovingProducts();
//    public List<Feedback> getAllFeedback();
}
