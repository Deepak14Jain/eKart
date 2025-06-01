package com.group4.eKart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map /product-images/** to the product-images directory
        registry.addResourceHandler("/product-images/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/product-images/");
    }
}
