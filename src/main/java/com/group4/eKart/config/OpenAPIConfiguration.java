package com.group4.eKart.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfiguration {
    @Bean
    public OpenAPI defineOpenApi() {
        Server server = new Server();
        server.setUrl("http://localhost:8080");
        server.setDescription("Development");

        Contact myContact = new Contact();
        myContact.setName("Deepak Jain");
        myContact.setEmail("deepakjain114@yahoo.com");


        Info information = new Info()
                .title("eKart: Online E-Commerce API")
                .version("1.0")
                .description("This API exposes endpoints to ekart.")
                .contact(myContact);
        return new OpenAPI().info(information).servers(List.of(server));
    }
}
