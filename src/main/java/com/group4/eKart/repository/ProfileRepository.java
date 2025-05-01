package com.group4.eKart.repository;

import com.group4.eKart.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    Profile findByUsername(String username);
    boolean existsByUsername(String username);
}
