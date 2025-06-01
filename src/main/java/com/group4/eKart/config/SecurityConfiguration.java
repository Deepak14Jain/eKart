package com.group4.eKart.config;

import com.group4.eKart.service.UserDetailsServiceImpl;
import com.group4.eKart.util.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfiguration(@Lazy UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/customer/login").permitAll()
                        .requestMatchers("/admin/login").permitAll()
                        .requestMatchers("/product-images/**").permitAll() // Allow access to product images
                        .requestMatchers("/customer/**").authenticated()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().permitAll())
                .addFilter(new BasicAuthenticationFilter(authenticationManager) {
                    @Override
                    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                            throws IOException, ServletException {
                        String header = request.getHeader("Authorization");
                        if (header != null && header.startsWith("Bearer ")) {
                            try {
                                String token = header.substring(7);
                                Claims claims = Jwts.parserBuilder()
                                        .setSigningKey(JwtUtil.getSecretKey())
                                        .build()
                                        .parseClaimsJws(token)
                                        .getBody();

                                String username = claims.getSubject();
                                String role = claims.get("role", String.class);

                                if (username != null && role != null) {
                                    List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
                                    SecurityContextHolder.getContext().setAuthentication(
                                            new UsernamePasswordAuthenticationToken(username, null, authorities));
                                }
                            } catch (Exception e) {
                                // Invalid token: clear context and return 403
                                SecurityContextHolder.clearContext();
                                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                                return;
                            }
                        }
                        chain.doFilter(request, response);
                    }
                })
                .csrf(httpSecurity -> httpSecurity.disable())
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
