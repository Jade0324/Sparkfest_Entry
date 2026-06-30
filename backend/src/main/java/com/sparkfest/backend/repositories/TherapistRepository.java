package com.sparkfest.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sparkfest.backend.models.Therapist;

public interface TherapistRepository extends JpaRepository<Therapist, Long> {

    java.util.Optional<Therapist> findByEmail(String email);
}