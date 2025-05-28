package com.group4.eKart.validator;

import com.group4.eKart.model.Profile;
import org.hibernate.service.spi.ServiceException;
import org.springframework.stereotype.Component;

@Component
public class ProfileValidations {
    public void validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new ServiceException("Username cannot be null or empty.");
        }
    }

    public void validatePassword(String password) {
        if (password == null || password.length() < 6) {
            throw new ServiceException("Password must be at least 6 characters long.");
        }
        if (!password.matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{6,}$")) {
            throw new ServiceException("Password must contain uppercase, lowercase, and a number.");
        }
    }

    public void validatePhone(String phoneNumber) {
        if (phoneNumber != null && !phoneNumber.isEmpty() && !phoneNumber.matches("^[0-9]{10}$")) {
            throw new ServiceException("Phone number must be 10 digits.");
        }
    }

    public void validateEmail(String email) {
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    public void validateProfile(Profile profile) throws ServiceException{
        validateUsername(profile.getUsername());
        validatePhone(profile.getPhno());
        validatePassword(profile.getPassword());
        validateEmail(profile.getEmail());
    }
}
